# We-Turborepo

React Native (Expo) + Vite Web 모노레포 구조입니다.

## 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 앱 실행

**Mobile (Expo)**

| 패키지명 | 설명 | 실행 명령어 |
| :--- | :--- | :--- |
| `@we/couple` | 커플용 Expo 앱 | `yarn turbo run start --filter=@we/couple` |
| `@we/pet` | 반려동물용 Expo 앱 | `yarn turbo run start --filter=@we/pet` |

**Web (Vite)**

| 패키지명 | 설명 | 실행 명령어 |
| :--- | :--- | :--- |
| `@we/web-couple` | 커플용 Vite 웹 앱 | `yarn turbo run dev --filter=@we/web-couple` |
| `@we/web-pet` | 반려동물용 Vite 웹 앱 | `yarn turbo run dev --filter=@we/web-pet` |

### 3. 빌드 / 린트

```bash
# 전체 빌드
yarn turbo run build

# 특정 앱만 빌드
yarn turbo run build --filter=@we/web-couple

# 전체 lint
yarn turbo run lint
```

## 프로젝트 구조

```text
we-turborepo/
├── apps/
│   ├── app/
│   │   ├── couple/           # Expo (React Native) 커플 앱 (@we/couple)
│   │   └── pet/              # Expo (React Native) 반려동물 앱 (@we/pet)
│   └── web/
│       ├── couple/           # Vite + React + TypeScript 커플 웹 앱
│       └── pet/              # Vite + React + TypeScript 반려동물 웹 앱
├── packages/
│   ├── ui/                   # 공통 UI 컴포넌트 패키지 (@we/ui)
│   ├── utils/                # 공통 유틸리티 패키지 (@we/utils)
│   ├── tsconfig/             # 공유 TypeScript 설정 (@we/tsconfig)
│   └── eslint-config/        # 공유 ESLint 설정 (@we/eslint-config)
├── package.json
└── turbo.json
```

## 절대 경로 사용
`~`를 사용하여 `src` 폴더에 대한 절대 경로 접근이 가능합니다.
예: `import { myUtil } from "~/utils/myUtil"`
