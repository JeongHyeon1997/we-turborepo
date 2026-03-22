# We-Turborepo

React Native (Expo) + Vite Web 모노레포 구조입니다.

## 시작하기

### 1. 의존성 설치

```bash
bun install
```

### 2. 앱 실행

**Mobile (Expo)**

| 패키지명 | 설명 | 실행 명령어 |
| :--- | :--- | :--- |
| `@we/couple` | 커플용 Expo 앱 | `bun turbo run start --filter=@we/couple` |
| `@we/pet` | 반려동물용 Expo 앱 | `bun turbo run start --filter=@we/pet` |
| `@we/marriage` | 부부용 Expo 앱 | `bun turbo run start --filter=@we/marriage` |

**Web (Vite)**

| 패키지명 | 설명 | 실행 명령어 |
| :--- | :--- | :--- |
| `@we/web-couple` | 커플용 Vite 웹 앱 | `bun turbo run dev --filter=@we/web-couple` |
| `@we/web-pet` | 반려동물용 Vite 웹 앱 | `bun turbo run dev --filter=@we/web-pet` |
| `@we/web-marriage` | 부부용 Vite 웹 앱 | `bun turbo run dev --filter=@we/web-marriage` |

### 3. 빌드 / 린트

```bash
# 전체 빌드
bun turbo run build

# 특정 앱만 빌드
bun turbo run build --filter=@we/web-couple

# 전체 lint
bun turbo run lint
```

## 프로젝트 구조

```text
we-turborepo/
├── apps/
│   ├── app/
│   │   ├── couple/           # Expo (React Native) 커플 앱 (@we/couple)
│   │   ├── pet/              # Expo (React Native) 반려동물 앱 (@we/pet)
│   │   └── marriage/         # Expo (React Native) 부부 앱 (@we/marriage)
│   └── web/
│       ├── couple/           # Vite + React + TypeScript 커플 웹 앱 (@we/web-couple)
│       ├── pet/              # Vite + React + TypeScript 반려동물 웹 앱 (@we/web-pet)
│       └── marriage/         # Vite + React + TypeScript 부부 웹 앱 (@we/web-marriage)
├── packages/
│   ├── ui/                   # React Native 공통 UI 컴포넌트 (@we/ui)
│   ├── ui-web/               # Web 공통 UI 컴포넌트 (@we/ui-web)
│   ├── utils/                # 공통 유틸리티 + 타입 (@we/utils)
│   ├── tailwind-config/      # 공유 Tailwind 설정 (@we/tailwind-config)
│   ├── tsconfig/             # 공유 TypeScript 설정 (@we/tsconfig)
│   └── eslint-config/        # 공유 ESLint 설정 (@we/eslint-config)
├── package.json
└── turbo.json
```

## 앱별 메인 컬러

색상 정의 위치: `packages/utils/src/colors/`

### couple (커플 앱)

> 따뜻한 핑크 계열 + 민트 포인트

| 역할 | 색상 | 헥스 |
| :--- | :---: | :--- |
| 헤더 / 네비 배경 | ![#feefef](https://placehold.co/16x16/feefef/feefef.png) | `#feefef` |
| 네비 테두리 | ![#fce0df](https://placehold.co/16x16/fce0df/fce0df.png) | `#fce0df` |
| Primary (핑크) | ![#f9d0d0](https://placehold.co/16x16/f9d0d0/f9d0d0.png) | `#f9d0d0` |
| 활성 탭 (민트) | ![#54d8dc](https://placehold.co/16x16/54d8dc/54d8dc.png) | `#54d8dc` |
| 비활성 탭 | ![#9ca3af](https://placehold.co/16x16/9ca3af/9ca3af.png) | `#9ca3af` |

### pet (반려동물 앱)

> 차분한 회청색 계열 + 라벤더 포인트

| 역할 | 색상 | 헥스 |
| :--- | :---: | :--- |
| 헤더 / 네비 배경 | ![#F1F3F5](https://placehold.co/16x16/F1F3F5/F1F3F5.png) | `#F1F3F5` |
| 테두리 (블루) | ![#A5C5DB](https://placehold.co/16x16/A5C5DB/A5C5DB.png) | `#A5C5DB` |
| Brand 핑크 | ![#F7BFCD](https://placehold.co/16x16/F7BFCD/F7BFCD.png) | `#F7BFCD` |
| 활성 탭 (퍼플) | ![#97A4D9](https://placehold.co/16x16/97A4D9/97A4D9.png) | `#97A4D9` |
| 비활성 탭 | ![#9ca3af](https://placehold.co/16x16/9ca3af/9ca3af.png) | `#9ca3af` |

### marriage (부부 앱)

> 따뜻한 골드 / 크림 계열 + 로즈골드 포인트

| 역할 | 색상 | 헥스 |
| :--- | :---: | :--- |
| 헤더 / 네비 배경 | ![#fffbf5](https://placehold.co/16x16/fffbf5/fffbf5.png) | `#fffbf5` |
| 헤더 테두리 | ![#fdf4e3](https://placehold.co/16x16/fdf4e3/fdf4e3.png) | `#fdf4e3` |
| 네비 테두리 | ![#fbedcc](https://placehold.co/16x16/fbedcc/fbedcc.png) | `#fbedcc` |
| 활성 탭 (로즈골드) | ![#d4a574](https://placehold.co/16x16/d4a574/d4a574.png) | `#d4a574` |
| 비활성 탭 | ![#9ca3af](https://placehold.co/16x16/9ca3af/9ca3af.png) | `#9ca3af` |

## 절대 경로 사용
`~`를 사용하여 `src` 폴더에 대한 절대 경로 접근이 가능합니다.
예: `import { myUtil } from "~/utils/myUtil"`
