# We Turborepo — Claude 가이드

## 프로젝트 개요

React Native (Expo) + Vite Web 모노레포. Bun workspaces + Turborepo.

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
├── ui-web/           # @we/ui-web — Web 전용 공유 UI
├── tailwind-config/  # @we/tailwind-config — 공유 Tailwind 설정
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

---

## UI 동일성 원칙

**웹과 앱의 화면 구성은 항상 동일해야 한다.** 구현 코드(RN vs React)는 달라도 된다.

### 기본 레이아웃

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

### Web AppLayout 스크롤 아키텍처

`AppLayout` root는 `height: 100dvh; overflow: hidden`으로 고정됩니다.
- `main` (`flex: 1; overflow-y: auto`) 이 기본 스크롤 담당
- 페이지에서 내부 스크롤이 필요하면 페이지 루트에 `height: 100%; overflow: hidden` 추가 후 내부 영역만 `overflow-y: auto` 처리
- BottomNav는 항상 화면 하단에 고정됨 (sticky 아님, flex flow)

### 각 앱의 조합 위치

- `apps/web/{name}/src/config/tabs.tsx` — 이 앱이 쓸 탭 목록
- `apps/web/{name}/src/config/headerIcons.tsx` — 헤더 우측 아이콘
- `apps/app/{name}/config/tabs.tsx` — 동일 구조, RN 버전

> 새 탭/페이지를 추가할 때는 웹과 앱 양쪽 config/tabs 에 모두 추가한다.

---

## 현재 앱별 탭 구성

### @we/couple (커플 앱)
| 탭 key | 라벨 | 아이콘 | 화면 |
|--------|------|--------|------|
| `diary` | 일기장 | book-outline | DiaryScreen / DiaryPage |
| `gallery` | 갤러리 | images-outline | GalleryScreen / GalleryPage |
| `community` | 커뮤니티 | chatbubbles-outline | CommunityScreen / CommunityPage |
| `my-info` | 내 정보 | person-outline | MyInfoScreen / MyInfoPage |

### @we/pet (펫 앱)
| 탭 key | 라벨 | 아이콘 | 화면 |
|--------|------|--------|------|
| `my-pet` | 내아이 | paw-outline | MyPetScreen(=DiaryScreen) / MyPetPage(=DiaryPage) |
| `gallery` | 갤러리 | images-outline | GalleryScreen / GalleryPage |
| `community` | 커뮤니티 | chatbubbles-outline | CommunityScreen / CommunityPage |
| `my-info` | 내 정보 | person-outline | MyInfoScreen / MyInfoPage |

> pet 앱의 MyPetScreen/MyPetPage는 DiaryScreen/DiaryPage를 그대로 위임합니다.

---

## 인증 / 회원 게이트 아키텍처

### 기능 분리 원칙

| 기능 | 비회원 (Guest) | 회원 (Member) |
|------|----------------|---------------|
| 일기 작성/갤러리 | ✓ (로컬 저장) | ✓ (서버 동기화) |
| 공지사항 보기 | ✓ | ✓ |
| 커뮤니티 읽기 | ✓ | ✓ |
| 커뮤니티 작성 | ✗ → AuthPrompt | ✓ |
| 커플/가족 연결 | ✗ → AuthPrompt | ✓ |
| 크로스 디바이스 동기화 | ✗ | ✓ |

### 데이터 저장 전략

```
비회원: 기기 로컬 (Web → localStorage, Native → 인메모리)
회원:   RDS + S3 (백엔드 구현 후)
사진 원본: S3, 메타데이터만 RDS
```

### 앱별 authStore 위치

```
apps/web/{name}/src/data/authStore.ts   (localStorage 영속화)
apps/app/{name}/data/authStore.ts       (인메모리, TODO: AsyncStorage)
```

authStore 공통 API:
```typescript
login(user: AuthUser): void
logout(): void
isLoggedIn(): boolean
getUser(): AuthUser | null
useAuth(): { user: AuthUser | null, isLoggedIn: boolean }
```

### Repository 패턴 (diaryRepo)

```
apps/web/{name}/src/data/diaryRepo.ts
apps/app/{name}/data/diaryRepo.ts
```

```typescript
// 비로그인: 로컬 스토어만 사용
// 로그인: 로컬 우선 + remoteApi 동기화 (백엔드 미구현 시 stub)
export function useDiaryEntries() { ... }
export function addEntry(entry: DiaryEntry) {
  addLocalEntry(entry);
  if (isLoggedIn()) remoteApi.addEntry(entry).catch(console.error);
}
```

> 실제 API URL이 생기면 `remoteApi` stub만 교체하면 된다. Screen/Page 코드 변경 불필요.

### 회원가입 시 로컬 → 서버 마이그레이션

```typescript
// 가입 완료 시 호출
async function migrateLocalData(userId: string) {
  const entries = getLocalEntries();
  if (entries.length > 0) {
    await fetch('/api/diary/migrate', { method: 'POST', body: JSON.stringify({ userId, entries }) });
  }
}
```

### 인증 공통 컴포넌트 (`@we/ui-web`, `@we/ui`)

| 컴포넌트 | 설명 | props |
|---------|------|-------|
| `AuthPromptModal` | 비회원이 유료 기능 접근 시 하단 시트 | `visible`, `message`, `accentColor`, `onLoginPress`, `onClose` |
| `AuthFeature` | 로그인/회원가입 전체 화면 | `onLogin`, `accentColor` |

### 인증 라우트

```
Web: /auth  →  AuthPage  (stackRoutes에 포함, 뒤로가기 있음)
Native: showAuth state  →  AuthFeature stackScreen
```

### 인증 게이트 패턴

**Web:**
```tsx
const { isLoggedIn } = useAuth();
const [showAuthPrompt, setShowAuthPrompt] = useState(false);

// 버튼 클릭 시
isLoggedIn ? navigate('/protected-route') : setShowAuthPrompt(true);

// JSX
<AuthPromptModal
  visible={showAuthPrompt}
  message="이 기능은 회원만 이용할 수 있어요"
  accentColor={ACCENT}
  onLoginPress={() => { setShowAuthPrompt(false); navigate('/auth'); }}
  onClose={() => setShowAuthPrompt(false)}
/>
```

**Native (App.tsx):**
```tsx
const { isLoggedIn } = useAuth();
// onConnectPress, onWritePress 등에서:
if (!isLoggedIn) { setShowAuthPrompt(true); return; }
// stackScreen에 showAuth case 추가
```

### AuthUser 타입 (`@we/utils`)

```typescript
interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatarColor?: string;
  provider: 'kakao' | 'apple' | 'google' | 'email';
}
```

---

## 모듈 설계 원칙 (기능 컴포넌트)

모든 기능은 **넣었다 뺐다 할 수 있는 모듈** 단위로 만든다.

### 계층 구조

```
packages/utils     → 타입, 컬러 토큰, 순수 함수 (플랫폼 무관)
packages/ui        → React Native 공통 기능 컴포넌트
packages/ui-web    → Web 공통 기능 컴포넌트
apps/app/{name}    → 앱별 조합 (accentColor, moods 등 앱 전용 값만)
apps/web/{name}    → 앱별 조합
```

### 현재 공통 기능 컴포넌트 목록

| 컴포넌트 | `@we/ui` (native) | `@we/ui-web` (web) | props |
|---------|-------------------|--------------------|-------|
| `DiaryFeature` | ✓ | ✓ | `accentColor`, `moods`, `moodModalTitle`, `entries`, `onAddEntry` |
| `GalleryFeature` | ✓ | ✓ | `accentColor`, `entries` |
| `AppLayout` | ✓ | ✓ | `logo`, `tabs`, `theme`, … |
| `Header` | ✓ | ✓ | `logo`, `icons`, `theme`, … |
| `BottomNav` | ✓ | ✓ | `tabs`, `theme`, … |
| `AnnouncementBanner` | ✓ | ✓ | `announcements`, `accentColor`, `onPress` |
| `DatePickerModal` | ✓ | ✓ | `visible`, `value`, `onConfirm`, `onCancel`, `title`, `maxDate`, `accentColor` |
| `AuthPromptModal` | ✓ | ✓ | `visible`, `message`, `accentColor`, `onLoginPress`, `onClose` |
| `AuthFeature` | ✓ | ✓ | `onLogin`, `accentColor` |

### 새 앱에서 DiaryFeature 사용 예시

**Web:**
```tsx
// pages/DiaryPage.tsx
import { DiaryFeature } from '@we/ui-web';
import type { Mood } from '@we/utils';
import { useDiaryEntries } from '../data/diaryRepo';  // diaryStore 대신 diaryRepo 사용

const MOODS: Mood[] = [ /* 앱별 기분 8종 */ ];

export function DiaryPage() {
  const { entries, addEntry } = useDiaryEntries();
  return (
    <DiaryFeature
      accentColor="#f4a0a0"
      moods={MOODS}
      moodModalTitle="오늘의 기분은 어떠셨나요? 🌸"
      entries={entries}
      onAddEntry={addEntry}
    />
  );
}
```

**Native:**
```tsx
// screens/DiaryScreen.tsx
import { useState } from 'react';
import { DiaryFeature } from '@we/ui';
import type { Mood, DiaryEntry } from '@we/utils';
import { getEntries, addEntry } from '../data/diaryRepo';

const MOODS: Mood[] = [ /* 앱별 기분 8종 */ ];

export function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>(getEntries());
  return (
    <DiaryFeature
      accentColor="#f4a0a0"
      moods={MOODS}
      moodModalTitle={'오늘의 기분은\n어떠셨나요? 🌸'}
      entries={entries}
      onAddEntry={e => setEntries(addEntry(e))}
    />
  );
}
```

### 앱별 diaryStore (Web + Native 공통)

DiaryFeature ↔ GalleryFeature 간 실시간 상태 공유를 위해 앱마다 `data/diaryStore.ts`를 Zustand로 만듭니다.
**페이지에서는 `diaryStore`를 직접 쓰지 않고 `diaryRepo`를 통해 접근합니다.**

```ts
// apps/{web|app}/{name}/src/data/diaryStore.ts
import { create } from 'zustand';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from './diaryEntries';

export const useDiaryStore = create<{
  entries: DiaryEntry[];
  addEntry: (e: DiaryEntry) => void;
  setEntries: (entries: DiaryEntry[]) => void;
}>()((set, get) => ({
  entries: [...myDiaryEntries],
  addEntry: (entry) => set({ entries: [entry, ...get().entries] }),
  setEntries: (entries) => set({ entries }),
}));

// 하위호환 헬퍼
export const getEntries = () => useDiaryStore.getState().entries;
export const addEntry = (e: DiaryEntry) => useDiaryStore.getState().addEntry(e);
export const useDiaryEntries = () =>
  useDiaryStore((s) => ({ entries: s.entries, addEntry: s.addEntry }));
```

---

## 새 기능 컴포넌트를 packages에 추가하는 법

1. `packages/ui-web/src/features/XxxFeature.tsx` 생성 (web)
2. `packages/ui/src/features/XxxFeature.tsx` 생성 (native)
3. 양쪽 `index.ts/tsx`에 export 추가
4. 앱별 Page/Screen은 import + props 전달만 하는 얇은 래퍼로 작성

**규칙:**
- 기능 컴포넌트 내부에서 앱별 색상(`coupleColors`, `petColors`)을 직접 import 하지 않는다
- 앱 고유 값(색상, 기분 목록, 모달 타이틀 등)은 모두 props로 받는다
- 뉴트럴 컬러(gray scale)는 파일 상단에 `const N = { gray50: '#f9fafb', ... }` 로 인라인 정의한다

---

## API / 상태관리 아키텍처

### 상태관리 — Zustand

모든 앱은 Zustand 스토어를 `data/` 폴더에 둔다.

| 스토어 | 위치 | persist | 용도 |
|--------|------|---------|------|
| `useAuthStore` | `data/authStore.ts` | Web: localStorage | user, accessToken, refreshToken, expiresAt |
| `useDiaryStore` | `data/diaryStore.ts` | 없음 (인메모리) | DiaryFeature ↔ GalleryFeature 공유 |
| `useCoupleStore` | `data/coupleStore.ts` | 없음 | 커플 연결 정보 (couple 앱만) |
| `useFamilyStore` | `data/familyStore.ts` | 없음 | 가족 그룹 정보 (pet 앱만) |

**authStore API:**
```ts
useAuthStore.getState().login(user, tokens?)  // tokens 포함 시 expiresAt 자동 계산
useAuthStore.getState().logout()
useAuthStore.getState().setTokens(tokens)     // 토큰 갱신 시 사용
// 하위호환 헬퍼
isLoggedIn()   getUser()   useAuth()  login()  logout()
```

### HTTP 클라이언트 — $axios

각 앱별 `lib/$axios.ts`에 axios 인스턴스를 둔다. 절대 다른 파일에서 `axios.create`를 직접 쓰지 않는다.

```
apps/{web|app}/{name}/lib/$axios.ts   ←  이 파일만 axios 인스턴스를 생성
apps/{web|app}/{name}/api/*.api.ts    ←  $axios를 import해서 API 함수 작성
```

**환경변수:**
- Web: `import.meta.env.VITE_API_URL`
- Native: `process.env.EXPO_PUBLIC_API_URL`

**토큰 갱신 전략 (잠수함 갱신):**
```
요청 전:  expiresAt - now < 5분  →  /auth/refresh 선제 호출 후 새 토큰 주입
요청 후:  401                   →  /auth/refresh 후 원래 요청 재시도
          401 재시도 실패        →  logout()
동시 요청: _refreshing Promise로 중복 refresh 방지 (단일 Promise 공유)
refresh 호출: _plain axios 사용 ($axios interceptor 루프 방지)
```

### API 함수 — src/api/

```
src/api/
├── auth.api.ts          # 전체 앱 공통
├── user.api.ts          # 전체 앱 공통
├── diary.api.ts         # 전체 앱 공통
├── community.api.ts     # 전체 앱 공통
├── announcement.api.ts  # 전체 앱 공통
├── couple.api.ts        # couple 앱만
└── family.api.ts        # pet 앱만
```

**API 함수 작성 패턴:**
```ts
// src/api/diary.api.ts
import { $axios } from '../lib/$axios';
import type { ApiResponse, DiaryListQuery, DiaryListResponse, ... } from '@we/utils';

export const getDiaryList = (query: DiaryListQuery) =>
  $axios.get<ApiResponse<DiaryListResponse>>('/diary', { params: query });

export const createDiary = (req: CreateDiaryRequest) =>
  $axios.post<ApiResponse<CreateDiaryResponse>>('/diary', req);
```

**컴포넌트/Hook에서 사용 패턴:**
```ts
const fetchList = useCallback(async () => {
  const { data } = await getDiaryList({ page: 1, size: 20 });
  setEntries(data.data.items);
}, []);

useEffect(() => { fetchList(); }, [fetchList]);
```

---

## 핵심 규칙

### packages/ui
- **React Native 전용** — `react-native`, `expo-image-picker` peer dependency
- Web 컴포넌트는 절대 여기에 추가하지 않는다

### packages/utils
- 플랫폼 무관 순수 함수 + 타입만
- 도메인 타입: `coupleColors`, `petColors`, `AppTheme`, `DiaryEntry`, `Mood`, `CommunityPost`, `createApi`, `fonts`, `formatCurrency`, `sleep`, `Announcement`, `CouplePartner`, `CoupleConnection`, `FamilyMember`, `FamilyGroup`, `AuthUser`
- API 타입 (`packages/utils/src/types/`): `UserBase`, `AuthTokens`, `LoginRequest`, `DiaryEntryBase`, `CommunityPostBase`, `CommunityCommentBase`, `AnnouncementBase`, `CoupleConnectionBase`, `FamilyGroupBase`, `PageResult`, `ApiResponse`, `ApiError` 등 → `/types` 스킬 참조

### packages/ui-web
- **Web 전용** — `react`, `react-dom`, `react-router-dom`, `react-icons` peer dependency
- Native 컴포넌트는 절대 여기에 추가하지 않는다

### packages/tailwind-config
- 공유 Tailwind 테마 토큰. Tailwind CSS v3 기반

### TypeScript
- Expo 앱: `@we/tsconfig/react-native.json` extend, `jsx: react-native`
- Web 앱: `@we/tsconfig/base.json` extend, `jsx: react-jsx`, `lib: [DOM]`
- Web 앱은 `tsconfig.node.json` 별도 존재 (vite.config.ts용)

### 명령어
- Expo 앱 실행: `bun turbo run start --filter=@we/couple`
- Web 앱 개발: `bun turbo run dev --filter=@we/web-couple`
- 전체 빌드: `bun turbo run build`
- 전체 lint: `bun turbo run lint`

---

## NativeWind / Tailwind CSS

### 스타일 시스템 구조

| 플랫폼 | 도구 | 설정 파일 |
|--------|------|-----------|
| Expo (Native) | NativeWind v4 | `babel.config.js`, `metro.config.js`, `global.css`, `tailwind.config.js` |
| Web (Vite) | Tailwind CSS v3 + PostCSS | `postcss.config.cjs`, `tailwind.config.cjs`, `src/index.css` |
| 공유 테마 | `@we/tailwind-config` | `packages/tailwind-config/tailwind.config.js` |

### 새 Expo 앱에 NativeWind 추가 시
- `babel.config.js` — nativewind/babel preset 추가
- `metro.config.js` — `withNativeWind(config, { input: './global.css' })`
- `global.css` — `@tailwind base/components/utilities`
- `tailwind.config.js` — `@we/tailwind-config` extend + content paths
- `nativewind-env.d.ts` — `/// <reference types="nativewind/types" />`
- `index.ts` — `import './global.css'` 맨 위에 추가
- `package.json` — `nativewind`, `tailwindcss`, `@we/tailwind-config` 추가

### 새 Web 앱에 Tailwind 추가 시
- `tailwind.config.cjs` — `@we/tailwind-config` extend + content paths
- `postcss.config.cjs` — tailwindcss + autoprefixer
- `src/index.css` — `@tailwind base/components/utilities` + 스크롤바 숨김 CSS
- `src/main.tsx` — `import './index.css'` 맨 위에 추가
- `package.json` — `tailwindcss`, `postcss`, `autoprefixer`, `@we/tailwind-config` 추가

### 표준 index.css 템플릿 (Web 앱)
```css
/* 폰트 로드 */
@font-face { font-family: 'BMJUA'; src: url('...') format('truetype'); font-display: swap; }
@font-face { font-family: 'BMHANNAPro'; src: url('...') format('truetype'); font-display: swap; }

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after { box-sizing: border-box; }
  #root { display: flex; flex-direction: column; min-height: 100dvh; }
  body { margin: 0; display: flex; flex-direction: column; font-family: 'BMJUA', sans-serif; }
  /* 스크롤바 숨김 */
  main::-webkit-scrollbar { display: none; }
  main { scrollbar-width: none; }
}
```

---

## 새 앱 추가 시 체크리스트

### Expo 앱 (`apps/app/{name}/`)
- [ ] `package.json` name: `@we/name`, dependencies: `expo`, `react`, `react-native`, `nativewind`, `expo-image-picker`, `zustand`, `axios`, `@we/ui`, `@we/utils`, `@we/tailwind-config`
- [ ] `tsconfig.json`: `@we/tsconfig/react-native.json` extend
- [ ] NativeWind 설정 파일 추가
- [ ] `config/theme.ts` — AppTheme 정의 (contentBg: `xxxColors.gray50`)
- [ ] `config/tabs.tsx` — 탭 목록 (DiaryFeature, GalleryFeature 등 import)
- [ ] `lib/$axios.ts` — axios 인스턴스 (EXPO_PUBLIC_API_URL, 토큰 interceptor)
- [ ] `data/diaryEntries.ts` — 초기 mock 데이터
- [ ] `data/authStore.ts` — Zustand 인증 스토어 (인메모리)
- [ ] `data/diaryStore.ts` — Zustand 일기 스토어
- [ ] `data/diaryRepo.ts` — Repository (로컬 ↔ 원격 라우팅)
- [ ] `api/auth.api.ts`, `api/diary.api.ts`, `api/community.api.ts`, `api/announcement.api.ts`

### Web 앱 (`apps/web/{name}/`)
- [ ] `package.json` name: `@we/web-name`, dependencies: `react`, `react-dom`, `react-icons`, `zustand`, `axios`, `@we/ui-web`, `@we/utils`, `@we/tailwind-config`
- [ ] `tsconfig.json`: `@we/tsconfig/base.json` extend + `jsx: react-jsx`
- [ ] `tsconfig.node.json`: vite.config.ts용 별도 설정
- [ ] Tailwind + PostCSS 설정 파일
- [ ] `src/index.css` — 표준 템플릿 적용
- [ ] `src/config/theme.ts` — AppTheme 정의 (contentBg: `xxxColors.gray50`)
- [ ] `src/config/tabs.tsx` — 탭 목록
- [ ] `src/router.tsx` — React Router 라우트 (`/auth` 포함)
- [ ] `src/lib/$axios.ts` — axios 인스턴스 (VITE_API_URL, 토큰 interceptor)
- [ ] `src/data/diaryEntries.ts` — 초기 mock 데이터
- [ ] `src/data/authStore.ts` — Zustand 인증 스토어 (localStorage persist)
- [ ] `src/data/diaryStore.ts` — Zustand 일기 스토어
- [ ] `src/data/diaryRepo.ts` — Repository (로컬 ↔ 원격 라우팅)
- [ ] `src/pages/AuthPage.tsx` — `AuthFeature` 래퍼
- [ ] `src/api/auth.api.ts`, `src/api/diary.api.ts`, `src/api/community.api.ts`, `src/api/announcement.api.ts`

---

## 스킬 사용법

| 슬래시 커맨드 | 설명 | Expo | Web |
|--------------|------|------|-----|
| `/types` | API 타입을 packages/utils/src/types/ 에 추가/수정 | ✓ | ✓ |
| `/page-structure` | 무거운 Screen/Page를 features/로 분리 | ✓ | ✓ |
| `/ui-extract` | 재사용 컴포넌트를 components/ui/로 추출 | ✓ | ✓ |
| `/constants` | 정적 데이터를 constants/data/로 추출 | ✓ | ✓ |
| `/hooks` | 컴포넌트 로직을 custom hook으로 추출 | ✓ | ✓ |
| `/utils` | 인라인 유틸 로직을 utils/로 추출 | ✓ | ✓ |
