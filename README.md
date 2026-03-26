# We Turborepo

커플 / 펫 / 웨딩 앱을 위한 모노레포. React Native(Expo) + Vite Web + NestJS API.

## 앱 목록

| 패키지 | 설명 | 실행 |
|--------|------|------|
| `@we/couple` | 커플 Expo 앱 | `bun turbo run start --filter=@we/couple` |
| `@we/pet` | 펫 Expo 앱 | `bun turbo run start --filter=@we/pet` |
| `@we/web-couple` | 커플 웹 앱 (Vite) | `bun turbo run dev --filter=@we/web-couple` |
| `@we/web-pet` | 펫 웹 앱 (Vite) | `bun turbo run dev --filter=@we/web-pet` |
| `@we/api` | REST API (NestJS) | `bun turbo run dev --filter=@we/api` |

## 공유 패키지

| 패키지 | 설명 |
|--------|------|
| `@we/ui` | React Native 전용 공통 컴포넌트 |
| `@we/ui-web` | Web 전용 공통 컴포넌트 |
| `@we/utils` | 공통 타입 + 순수 유틸 (플랫폼 무관) |
| `@we/tailwind-config` | 공유 Tailwind 테마 |
| `@we/tsconfig` | 공유 TypeScript 설정 |

## 기술 스택

| 영역 | 기술 |
|------|------|
| 패키지 매니저 | Bun + Turborepo |
| Mobile | Expo (React Native) + NativeWind v4 |
| Web | Vite + React + Tailwind CSS v3 |
| API | NestJS 10 + Prisma 5 |
| DB | Supabase PostgreSQL (multiSchema) |
| Storage | Supabase Storage (S3 호환) |
| 인증 | JWT (access + refresh) |
| 배포 | Vercel (Web + API) |

## 시작하기

### 설치

```bash
bun install
```

### 환경변수 설정

```bash
cp apps/api/.env.example apps/api/.env
# .env 파일에 Supabase / JWT 값 입력
```

### 개발 서버

```bash
bun turbo run dev --filter=@we/api           # API (localhost:3000)
bun turbo run dev --filter=@we/web-couple    # 커플 웹
bun turbo run dev --filter=@we/web-pet       # 펫 웹
bun turbo run start --filter=@we/couple      # 커플 Expo
bun turbo run start --filter=@we/pet         # 펫 Expo
```

### DB

```bash
bun turbo run db:generate --filter=@we/api   # Prisma 클라이언트 생성
bun turbo run db:migrate --filter=@we/api    # 마이그레이션 배포
```

### 빌드 / 린트

```bash
bun turbo run build
bun turbo run lint
```

## API 문서

개발 서버 실행 후 `http://localhost:3000/docs`

헬스 체크: `GET http://localhost:3000/api/health`

## 프로젝트 구조

```
apps/
├── api/                     # @we/api — NestJS REST API
│   ├── src/
│   │   ├── auth/            # 인증 (이메일 + 소셜: Google/Kakao/Naver)
│   │   ├── user/            # 사용자 프로필
│   │   ├── couple/          # 커플 연결 + 다이어리 + 커뮤니티
│   │   ├── pet/             # 펫 가족 + 펫 + 다이어리 + 커뮤니티
│   │   ├── marriage/        # 웨딩 연결
│   │   ├── announcement/    # 공지사항
│   │   ├── storage/         # 파일 업로드 (S3 presigned URL)
│   │   ├── health/          # 헬스 체크
│   │   ├── prisma/          # PrismaService
│   │   └── common/          # 가드, 데코레이터, 필터
│   ├── prisma/
│   │   ├── schema.prisma    # DB 스키마 (shared/couple/pet/marriage)
│   │   └── migrations/
│   ├── api/index.ts         # Vercel 서버리스 진입점
│   └── vercel.json
├── app/
│   ├── couple/              # @we/couple — Expo 커플 앱
│   └── pet/                 # @we/pet — Expo 펫 앱
└── web/
    ├── couple/              # @we/web-couple — Vite 커플 웹
    └── pet/                 # @we/web-pet — Vite 펫 웹
packages/
├── ui/                      # RN 공통 컴포넌트 (DiaryFeature, GalleryFeature 등)
├── ui-web/                  # Web 공통 컴포넌트
├── utils/
│   └── src/types/           # 공유 API 타입
└── tailwind-config/
```

## DB 스키마

Supabase PostgreSQL, 4개 스키마로 분리:

```
shared   → users, refresh_tokens, announcements
couple   → couple_connections, couple_invites, diary_entries, community_*
pet      → family_groups, family_members, family_invites, pets, diary_entries, community_*
marriage → marriage_connections, marriage_invites
```

## 앱별 메인 컬러

색상 정의: `packages/utils/src/colors/`

### couple — 따뜻한 핑크 + 민트

| 역할 | 헥스 |
|------|------|
| 헤더 / 네비 배경 | `#feefef` |
| Primary (핑크) | `#f9d0d0` |
| 활성 탭 (민트) | `#54d8dc` |

### pet — 차분한 회청색 + 라벤더

| 역할 | 헥스 |
|------|------|
| 헤더 / 네비 배경 | `#F1F3F5` |
| 테두리 (블루) | `#A5C5DB` |
| 활성 탭 (퍼플) | `#97A4D9` |

### marriage — 골드 / 크림 + 로즈골드

| 역할 | 헥스 |
|------|------|
| 헤더 / 네비 배경 | `#fffbf5` |
| 활성 탭 (로즈골드) | `#d4a574` |
