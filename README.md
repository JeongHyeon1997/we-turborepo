# We-Turborepo

React Native (Expo) 모노레포 구조입니다.

## 시작하기

### 1. 의존성 설치
루트 디렉토리에서 다음 명령어를 실행합니다.
```bash
yarn install
```

### 2. 프로젝트 실행

#### 앱별 실행 명령어

| 앱 이름 | 설명 | 실행 명령어 |
| :--- | :--- | :--- |
| **Native** | 기본 Expo 앱 | `yarn turbo run start --filter=@we/native` |
| **Couple** | 커플용 예시 앱 💑 | `yarn turbo run start --filter=@we/couple` |
| **Pet** | 반려동물용 예시 앱 🐾 | `yarn turbo run start --filter=@we/pet` |

또한 루트 디렉토리에서 간단히 `yarn start`를 실행하면 모든 앱의 개발 서버가 한꺼번에 실행됩니다.

#### 특정 앱만 실행하기 (Filtering)
프로젝트가 여러 개일 경우 `--filter` 옵션을 사용하여 특정 앱만 실행할 수 있습니다.
```bash
# '@we/native' 앱만 실행
yarn turbo run start --filter=@we/native

# '@we/native' 앱과 의존성 패키지들을 함께 빌드
yarn turbo run build --filter=@we/native...
```

#### Lint 체크
```bash
yarn turbo run lint
```

#### 빌드
```bash
yarn turbo run build
```

## 프로젝트 구조

```text
we-turborepo/
├── apps/
│   └── native/           # Expo (React Native) 애플리케이션
├── packages/
│   ├── ui/               # 공통 UI 컴포넌트 패키지 (@we/ui)
│   ├── utils/            # 공통 유틸리티 패키지 (@we/utils)
│   ├── tsconfig/         # 공유 TypeScript 설정 (@we/tsconfig)
│   └── eslint-config/    # 공유 ESLint 설정 (@we/eslint-config)
├── package.json          # 워크스페이스 및 공통 스크립트 설정
└── turbo.json            # Turborepo 파이프라인 설정
```

## 절대 경로 사용
각 패키지 및 앱에서 `~`를 사용하여 `src` (또는 루트) 폴더에 대한 절대 경로 접근이 가능합니다.
예: `import { MyButton } from "~/components/MyButton"`
