# We Turborepo — Claude 가이드

## 프로젝트 개요

React Native (Expo) + Vite Web + NestJS API 모노레포. Bun workspaces + Turborepo.

## 디렉토리 구조

```
apps/
├── app/              # Expo (React Native) 앱
│   ├── couple/       # @we/couple
│   └── pet/          # @we/pet
├── web/              # Vite + React + TypeScript 웹 앱
│   ├── couple/       # @we/web-couple
│   └── pet/          # @we/web-pet
└── api/              # @we/api — NestJS REST API (Vercel 배포)
packages/
├── ui/               # @we/ui — React Native 전용 공유 UI
├── ui-web/           # @we/ui-web — Web 전용 공유 UI
├── tailwind-config/  # @we/tailwind-config — 공유 Tailwind 설정
├── utils/            # @we/utils — 플랫폼 무관 공유 유틸 + API 타입
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
| `apps/api` | `@we/api` |

---

## 명령어

```bash
# 개발 서버
bun turbo run dev --filter=@we/web-couple   # 웹
bun turbo run dev --filter=@we/api          # API
bun turbo run start --filter=@we/couple     # Expo

# 빌드
bun turbo run build --filter=@we/api

# DB
bun turbo run db:generate --filter=@we/api  # Prisma 클라이언트 생성
bun turbo run db:migrate --filter=@we/api   # 마이그레이션 배포
```

---

# BACKEND — NestJS API (`apps/api`)

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | NestJS 10 (Express adapter) |
| ORM | Prisma 5 (multiSchema) |
| DB | Supabase PostgreSQL |
| 스토리지 | Supabase Storage (S3 호환) |
| 인증 | JWT (access + refresh) |
| 문서화 | Swagger (`/docs`) |
| 배포 | Vercel serverless |

## 소스 구조

```
apps/api/src/
├── main.ts                  # 앱 부트스트랩, createApp() export (Vercel용)
├── app.module.ts            # 루트 모듈
├── auth/                    # 인증 (이메일 + 소셜: Google/Kakao/Naver)
├── user/                    # 사용자 프로필
├── couple/                  # 커플 연결 + 다이어리 + 커뮤니티
├── pet/                     # 펫 가족 그룹 + 펫 + 다이어리 + 커뮤니티
├── marriage/                # 결혼 연결
├── announcement/            # 공지사항 (읽기 전용)
├── storage/                 # S3 presigned URL 파일 관리
├── prisma/                  # PrismaService (싱글톤)
└── common/
    ├── decorators/
    │   ├── current-user.decorator.ts   # @CurrentUser() → userId
    │   └── public.decorator.ts         # @Public() → 인증 제외
    ├── guards/jwt-auth.guard.ts        # 전역 JWT 가드
    └── filters/http-exception.filter.ts
```

## API 라우팅

| 모듈 | 경로 | 설명 |
|------|------|------|
| Auth | `POST /api/auth/signup` `POST /api/auth/login` `POST /api/auth/refresh` `POST /api/auth/logout` | 인증 |
| User | `GET/PUT /api/users/me` | 내 프로필 |
| Couple | `/api/couple` | 커플 연결 |
| Couple Diary | `/api/couple/diary` | 커플 다이어리 CRUD |
| Couple Community | `/api/couple/community/posts` | 커플 커뮤니티 |
| Pet Family | `/api/pet/family` | 펫 가족 그룹 |
| Pet | `/api/pet/pets` | 펫 관리 |
| Pet Diary | `/api/pet/diary` | 펫 다이어리 CRUD |
| Pet Community | `/api/pet/community/posts` | 펫 커뮤니티 |
| Marriage | `/api/marriage` | 결혼 연결 |
| Announcement | `/api/announcements` | 공지사항 |
| Storage | `/api/storage` | 파일 업로드/조회 |

Swagger 전체 목록: `http://localhost:3000/docs`

## 핵심 패턴

### 인증
```ts
// 전체 앱에 JwtAuthGuard 전역 적용 (app.module.ts)
// 공개 엔드포인트만 @Public() 붙임
@Public()
@Post('login')
login(@Body() dto: LoginDto) { ... }

// 현재 유저 ID 주입
@Get('me')
getMe(@CurrentUser() userId: string) { ... }
```

### Controller → Service → Prisma 계층
```ts
// Controller: 요청 파싱 + 응답만
@Get(':id')
findOne(@CurrentUser() userId: string, @Param('id') id: string) {
  return this.service.findOne(userId, id);
}

// Service: 비즈니스 로직 + 에러
async findOne(userId: string, id: string) {
  const item = await this.prisma.table.findUnique({ where: { id } });
  if (!item) throw new NotFoundException('찾을 수 없습니다.');
  if (item.userId !== userId) throw new ForbiddenException('권한 없음.');
  return item;
}
```

### 페이지네이션
```ts
const skip = (page - 1) * size;
const [items, total] = await this.prisma.$transaction([
  this.prisma.table.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
  this.prisma.table.count({ where }),
]);
return { items, total, page, size, totalPages: Math.ceil(total / size) };
```

### 초대 코드
```ts
const code = Math.random().toString(36).slice(2, 8).toUpperCase();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
```

## 환경변수 (`apps/api/.env`)

```
DATABASE_URL        # Supabase Transaction Pooler (6543) — 런타임
DIRECT_URL          # Supabase Session Pooler (5432) — 마이그레이션
JWT_SECRET
JWT_ACCESS_EXPIRY_MS
JWT_REFRESH_EXPIRY_MS
SUPABASE_S3_URL
SUPABASE_PUBLIC_URL
SUPABASE_ACCESS_KEY
SUPABASE_SECRET_KEY
SUPABASE_BUCKET
SUPABASE_REGION
PORT
NODE_ENV
```

## DB 스키마 구조

Prisma multiSchema: `shared` / `couple` / `pet` / `marriage`

```
shared.users              # 공통 사용자
shared.refresh_tokens     # JWT 리프레시 토큰
shared.announcements      # 공지사항

couple.couple_connections # 커플 연결
couple.couple_invites     # 초대 코드
couple.diary_entries
couple.community_posts
couple.community_likes
couple.community_comments
couple.community_reports

pet.family_groups         # 펫 가족 그룹
pet.family_group_members
pet.family_invites
pet.pets
pet.diary_entries
pet.community_posts / likes / comments / reports

marriage.marriage_connections
marriage.marriage_invites
```

## Vercel 배포 구조

```
api/index.ts    # 서버리스 핸들러 (main.ts의 createApp() 재사용)
vercel.json     # 모든 요청을 api/index.ts로 라우팅
```

---

# FRONTEND — Web (`apps/web/*`) + Native (`apps/app/*`)

## UI 동일성 원칙

**웹과 앱의 화면 구성은 항상 동일해야 한다.** 구현 코드(RN vs React)는 달라도 된다.

### 기본 레이아웃

```
┌─────────────────────────────┐
│  Header                     │
├─────────────────────────────┤
│  Content (Outlet / screen)  │
├─────────────────────────────┤
│  BottomNav                  │
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
- 페이지에서 내부 스크롤이 필요하면 페이지 루트에 `height: 100%; overflow: hidden` 추가

### 각 앱의 조합 위치

- `apps/web/{name}/src/config/tabs.tsx` — 탭 목록
- `apps/web/{name}/src/config/headerIcons.tsx` — 헤더 우측 아이콘
- `apps/app/{name}/config/tabs.tsx` — 동일 구조, RN 버전

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
| `my-pet` | 내아이 | paw-outline | MyPetScreen / MyPetPage |
| `gallery` | 갤러리 | images-outline | GalleryScreen / GalleryPage |
| `community` | 커뮤니티 | chatbubbles-outline | CommunityScreen / CommunityPage |
| `my-info` | 내 정보 | person-outline | MyInfoScreen / MyInfoPage |

---

## 인증 / 회원 게이트 아키텍처

| 기능 | 비회원 (Guest) | 회원 (Member) |
|------|----------------|---------------|
| 일기 작성/갤러리 | ✓ (로컬 저장) | ✓ (서버 동기화) |
| 커뮤니티 읽기 | ✓ | ✓ |
| 커뮤니티 작성 | ✗ → AuthPrompt | ✓ |
| 커플/가족 연결 | ✗ → AuthPrompt | ✓ |

### authStore 공통 API

```typescript
login(user: AuthUser): void
logout(): void
isLoggedIn(): boolean
getUser(): AuthUser | null
useAuth(): { user: AuthUser | null, isLoggedIn: boolean }
```

---

## 공통 기능 컴포넌트 목록

| 컴포넌트 | `@we/ui` | `@we/ui-web` | props |
|---------|----------|--------------|-------|
| `DiaryFeature` | ✓ | ✓ | `accentColor`, `moods`, `entries`, `onAddEntry` |
| `GalleryFeature` | ✓ | ✓ | `accentColor`, `entries` |
| `AppLayout` | ✓ | ✓ | `logo`, `tabs`, `theme` |
| `Header` | ✓ | ✓ | `logo`, `icons`, `theme` |
| `BottomNav` | ✓ | ✓ | `tabs`, `theme` |
| `AnnouncementBanner` | ✓ | ✓ | `announcements`, `accentColor` |
| `AuthPromptModal` | ✓ | ✓ | `visible`, `message`, `accentColor`, `onLoginPress`, `onClose` |
| `AuthFeature` | ✓ | ✓ | `onLogin`, `accentColor` |

---

## API 상태관리 아키텍처

### Zustand 스토어

| 스토어 | 위치 | persist | 용도 |
|--------|------|---------|------|
| `useAuthStore` | `data/authStore.ts` | Web: localStorage | user, accessToken, refreshToken |
| `useDiaryStore` | `data/diaryStore.ts` | 없음 | DiaryFeature ↔ GalleryFeature 공유 |

### HTTP 클라이언트 — $axios

```
apps/{web|app}/{name}/lib/$axios.ts   ←  axios 인스턴스 (이 파일만)
apps/{web|app}/{name}/api/*.api.ts    ←  $axios import 후 API 함수
```

**토큰 갱신 전략:**
- 요청 전: `expiresAt - now < 5분` → 선제 refresh
- 요청 후: 401 → refresh 후 재시도
- 동시 요청: `_refreshing Promise`로 중복 방지

### Repository 패턴

```
data/diaryRepo.ts   ←  페이지에서 직접 접근하는 레이어
                        비로그인: 로컬 스토어만
                        로그인: 로컬 우선 + API 동기화
```

---

## 모듈 설계 원칙

```
packages/utils     → 타입, 색상 토큰, 순수 함수 (플랫폼 무관)
packages/ui        → React Native 전용 공통 기능 컴포넌트
packages/ui-web    → Web 전용 공통 기능 컴포넌트
apps/app/{name}    → 앱별 조합 (accentColor, moods 등 앱 전용 값만)
apps/web/{name}    → 앱별 조합
```

**규칙:**
- 기능 컴포넌트 내부에서 앱별 색상을 직접 import 하지 않는다
- 앱 고유 값은 모두 props로 받는다
- `packages/ui`는 React Native 전용 — Web 컴포넌트 절대 추가 금지
- `packages/ui-web`은 Web 전용 — Native 컴포넌트 절대 추가 금지

---

## NativeWind / Tailwind CSS

| 플랫폼 | 도구 | 설정 파일 |
|--------|------|-----------|
| Expo (Native) | NativeWind v4 | `babel.config.js`, `metro.config.js`, `global.css` |
| Web (Vite) | Tailwind CSS v3 + PostCSS | `postcss.config.cjs`, `tailwind.config.cjs` |
| 공유 테마 | `@we/tailwind-config` | `packages/tailwind-config/tailwind.config.js` |

---

## 스킬 사용법

### 프론트엔드 스킬

| 슬래시 커맨드 | 설명 | 사용 시점 |
|--------------|------|-----------|
| `/types` | API 타입을 `packages/utils/src/types/`에 추가 | 새 API 연동 전 |
| `/page-structure` | 무거운 Screen/Page를 features/로 분리 | 컴포넌트 500줄 이상 |
| `/ui-extract` | 재사용 컴포넌트를 packages로 추출 | 2개 이상 앱에서 중복 |
| `/constants` | 인라인 정적 데이터를 constants/data/로 추출 | 하드코딩 배열/객체 |
| `/hooks` | 컴포넌트 로직을 custom hook으로 추출 | 상태+API 로직 분리 |
| `/utils` | 인라인 유틸 로직을 utils/로 추출 | 순수 함수 분리 |

### 백엔드 스킬

| 슬래시 커맨드 | 설명 | 사용 시점 |
|--------------|------|-----------|
| `/api-module` | 새 NestJS 도메인 모듈 전체 생성 | 새 도메인 추가 |
| `/api-endpoint` | 기존 모듈에 새 엔드포인트 추가 | 기능 확장 |
