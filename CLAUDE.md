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
