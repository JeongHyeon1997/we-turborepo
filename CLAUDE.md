# We Turborepo — Claude 가이드

## 프로젝트 개요

React Native (Expo) + Vite Web 모노레포. Yarn workspaces + Turborepo.

## 디렉토리 구조

```
apps/
├── app/              # Expo (React Native) 앱
│   ├── couple/       # @we/couple
│   └── pet/          # @we/pet
└── web/              # Vite + React + TypeScript 웹 앱
    ├── couple/       # @we/web-couple
    └── pet/          # @we/web-pet
packages/
├── ui/               # @we/ui — React Native 전용 공유 UI
├── utils/            # @we/utils — 플랫폼 무관 공유 유틸
├── tsconfig/         # @we/tsconfig
└── eslint-config/    # @we/eslint-config
```

## 패키지 이름

| 디렉토리 | 패키지명 |
|----------|----------|
| `apps/app/couple` | `@we/couple` |
| `apps/app/pet` | `@we/pet` |
| `apps/web/couple` | `@we/web-couple` |
| `apps/web/pet` | `@we/web-pet` |

## UI 동일성 원칙

**웹과 앱의 화면 구성은 항상 동일해야 한다.** 구현 코드(RN vs React)는 달라도 된다.

### 기본 레이아웃

모든 앱(web/native 공통)은 동일한 레이아웃 골조를 사용한다:

```
┌─────────────────────────────┐
│  Header                     │
│  [앱 아이콘]     [아이콘들] │
├─────────────────────────────┤
│                             │
│  Content (Outlet / screen)  │
│                             │
├─────────────────────────────┤
│  BottomNav                  │
│  [탭1] [탭2] [탭3]          │
└─────────────────────────────┘
```

### 플랫폼별 구현

| 역할 | Web (`@we/ui-web`) | Native (`@we/ui`) |
|------|--------------------|-------------------|
| 레이아웃 | `AppLayout` → `<Outlet />` | `AppLayout` → active screen |
| 헤더 | `Header` | `Header` |
| 하단 탭 | `BottomNav` + react-router NavLink | `BottomNav` + Pressable |
| 탭 정의 | `key, path, label, icon` | `key, label, icon, screen` |

### 각 앱의 조합 위치

- `apps/web/{name}/src/config/tabs.tsx` — 이 앱이 쓸 탭 목록
- `apps/web/{name}/src/config/headerIcons.tsx` — 헤더 우측 아이콘
- `apps/app/{name}/config/tabs.tsx` — 동일 구조, RN 버전

> 새 탭/페이지를 추가할 때는 웹과 앱 양쪽 config/tabs 에 모두 추가한다.

## 모듈 설계 원칙

모든 기능은 **넣었다 뺐다 할 수 있는 모듈** 단위로 만든다.

- 기능 하나 = 파일(또는 폴더) 하나. import 한 줄로 켜고, 제거하면 꺼진다
- 프로젝트별로 필요한 것만 조합해서 사용한다
- 공유 패키지(`packages/`)는 전체 목록을 정의하고, 각 앱은 필요한 것만 import한다

### 예시: 바텀탭

```ts
// packages/ui/src/navigation/tabs.ts — 전체 탭 정의
export { HomeTab } from './HomeTab';
export { DiaryTab } from './DiaryTab';
export { CalendarTab } from './CalendarTab';
export { SettingsTab } from './SettingsTab';

// apps/app/couple — 1,2,3만 사용
import { HomeTab, DiaryTab, CalendarTab } from '@we/ui/navigation/tabs';

// apps/app/pet — 1,4만 사용
import { HomeTab, SettingsTab } from '@we/ui/navigation/tabs';
```

### 적용 범위

| 항목 | 공유 위치 | 조합 위치 |
|------|-----------|-----------|
| 탭/네비게이션 항목 | `packages/ui` | 각 앱 navigator |
| 색상 토큰 | `packages/utils/src/colors/` | 각 앱 theme |
| 공용 컴포넌트 | `packages/ui` | 각 앱 screen |
| 유틸 함수 | `packages/utils` | 각 앱 필요한 곳 |

> 새 기능을 만들 때는 항상 "이걸 다른 앱에서 빼도 나머지가 정상 동작하는가?"를 확인한다.

## 핵심 규칙

### packages/ui
- **React Native 전용** — `react-native` peer dependency 있음
- Web 컴포넌트는 절대 여기에 추가하지 않는다
- Web 공용 컴포넌트가 필요하면 `packages/ui-web` 신규 패키지 생성

### packages/utils
- 플랫폼 무관 순수 함수만 — Node API, RN API, Browser API 사용 금지
- Expo 앱과 Web 앱이 모두 의존하므로 platform-specific 코드 금지

### TypeScript
- Expo 앱: `@we/tsconfig/react-native.json` extend, `jsx: react-native`
- Web 앱: `@we/tsconfig/base.json` extend, `jsx: react-jsx`, `lib: [DOM]`
- Web 앱은 `tsconfig.node.json` 별도 존재 (vite.config.ts용)

### 명령어
- Expo 앱 실행: `start` 스크립트 → `yarn turbo run start --filter=@we/couple`
- Web 앱 개발: `dev` 스크립트 → `yarn turbo run dev --filter=@we/web-couple`
- 전체 빌드: `yarn turbo run build`
- 전체 lint: `yarn turbo run lint`

## 스킬 사용법

| 슬래시 커맨드 | 설명 | Expo | Web |
|--------------|------|------|-----|
| `/page-structure` | 무거운 Screen/Page를 features/로 분리 | ✓ | ✓ |
| `/ui-extract` | 재사용 컴포넌트를 components/ui/로 추출 | ✓ | ✓ |
| `/constants` | 정적 데이터를 constants/data/로 추출 | ✓ | ✓ |
| `/hooks` | 컴포넌트 로직을 custom hook으로 추출 | ✓ | ✓ |
| `/utils` | 인라인 유틸 로직을 utils/로 추출 | ✓ | ✓ |

## 새 앱 추가 시 체크리스트

**Expo 앱 추가** (`apps/app/{name}/`):
- `package.json` name: `@we/name`
- `tsconfig.json`: `@we/tsconfig/react-native.json` extend
- dependencies: `expo`, `react`, `react-native`, `@we/ui`, `@we/utils`

**Web 앱 추가** (`apps/web/{name}/`):
- `package.json` name: `@we/web-name`
- `tsconfig.json`: `@we/tsconfig/base.json` extend + `jsx: react-jsx`
- `tsconfig.node.json`: vite.config.ts용 별도 설정
- dependencies: `react`, `react-dom`, `@we/utils` (ui는 web 전용 패키지 생성 후)
- devDependencies: `vite`, `@vitejs/plugin-react`
