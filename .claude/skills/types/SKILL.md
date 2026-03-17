---
name: types
description: API 타입을 packages/utils/src/types/ 에 선언한다. DB 테이블 구조를 Base 타입으로 먼저 선언하고, CRUD별 차이는 상속/유틸리티 타입으로 파생한다.
argument-hint: [도메인명 또는 대상 파일]
---

# Types Skill

API 타입을 `packages/utils/src/types/` 에 추가하거나 수정한다.

## 파일 위치

```
packages/utils/src/types/
├── common.types.ts        — Timestamps, PaginationQuery, PageResult, ApiResponse, ApiError
├── user.types.ts          — UserBase + Auth/User CRUD 타입
├── diary.types.ts         — DiaryEntryBase + Diary CRUD 타입
├── community.types.ts     — CommunityPostBase, CommentBase, ReportBase + CRUD 타입
├── announcement.types.ts  — AnnouncementBase + Read 타입
├── couple.types.ts        — CoupleConnectionBase, CoupleInviteBase + CRUD 타입
├── family.types.ts        — FamilyGroupBase, FamilyMemberBase + CRUD 타입
└── index.ts               — barrel export
```

새 도메인 추가 시 `{domain}.types.ts` 파일을 만들고 `index.ts` 에 re-export 한다.

## 핵심 규칙: Base → 파생 패턴

### 1. Base 타입 = DB 테이블 컬럼과 1:1 매핑

```ts
// DB Table: diary_entries
export interface DiaryEntryBase extends Timestamps {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;      // nullable 컬럼은 `T | null`
  imageUrl: string | null;
}
```

- `Timestamps` (`createdAt`, `updatedAt`) 를 항상 extend 한다
- nullable 컬럼은 `string | undefined` 가 아닌 **`string | null`** 로 선언한다
- 서버 생성 컬럼(`id`, `userId`, `createdAt`, `updatedAt`)은 Base 에 포함한다

### 2. CRUD 타입은 Base 에서 파생

| 용도 | 패턴 | 예시 |
|------|------|------|
| Create 요청 | `Omit<Base, 서버생성컬럼>` | `Omit<DiaryEntryBase, 'id' \| 'userId' \| 'createdAt' \| 'updatedAt'>` |
| Update 요청 | `Partial<CreateRequest>` | `Partial<CreateDiaryRequest>` |
| Read 응답 | `Base` 또는 `Base & { 추가필드 }` | `DiaryEntryBase` |
| 민감 필드 제거 | `Omit<Base, 제거할컬럼>` | `Omit<UserBase, 'providerUserId'>` |

```ts
export type CreateDiaryRequest = Omit<DiaryEntryBase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateDiaryRequest = Partial<CreateDiaryRequest>;
export type CreateDiaryResponse = DiaryEntryBase;
```

### 3. 관계(Relation) 포함 응답은 Base를 extend

```ts
// FamilyGroupBase 만으로는 members 정보가 없음
export interface FamilyGroupResponse extends FamilyGroupBase {
  members: FamilyMemberBase[];
}
```

### 4. 페이지네이션 응답

```ts
import type { PageResult } from './common.types';

export type DiaryListResponse = PageResult<DiaryEntryBase>;
```

### 5. 네이밍 컨벤션

| 종류 | 패턴 | 예 |
|------|------|----|
| DB 테이블 타입 | `{Entity}Base` | `DiaryEntryBase` |
| 목록 조회 응답 | `{Entity}ListResponse` | `DiaryListResponse` |
| 상세 조회 응답 | `{Entity}DetailResponse` | `DiaryDetailResponse` |
| 생성 요청 | `Create{Entity}Request` | `CreateDiaryRequest` |
| 생성 응답 | `Create{Entity}Response` | `CreateDiaryResponse` |
| 수정 요청 | `Update{Entity}Request` | `UpdateDiaryRequest` |
| 수정 응답 | `Update{Entity}Response` | `UpdateDiaryResponse` |
| 삭제 | 주석으로 표기 | `// DELETE /diary/:id → 204 No Content` |

### 6. common.types 활용

모든 타입 파일에서 `Timestamps`, `PaginationQuery`, `PageResult`, `ApiResponse` 를 import 해서 재사용한다. 중복 선언 금지.

## API 목록 (현재 정의된 엔드포인트)

### Auth (`/auth`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| POST | `/auth/login` | `LoginRequest` \| `OAuthLoginRequest` | `LoginResponse` |
| POST | `/auth/signup` | `SignupRequest` | `LoginResponse` |
| POST | `/auth/logout` | — | 204 |
| POST | `/auth/refresh` | `RefreshTokenRequest` | `AuthTokens` |

### User (`/users`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/users/me` | — | `UserResponse` |
| PUT | `/users/me` | `UpdateUserRequest` | `UpdateUserResponse` |

### Diary (`/diary`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/diary` | `DiaryListQuery` | `DiaryListResponse` |
| POST | `/diary` | `CreateDiaryRequest` | `CreateDiaryResponse` |
| GET | `/diary/:id` | — | `DiaryDetailResponse` |
| PUT | `/diary/:id` | `UpdateDiaryRequest` | `UpdateDiaryResponse` |
| DELETE | `/diary/:id` | — | 204 |

### Community (`/community/posts`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/community/posts` | `CommunityListQuery` | `CommunityListResponse` |
| POST | `/community/posts` | `CreatePostRequest` | `CreatePostResponse` |
| GET | `/community/posts/:id` | — | `CommunityDetailResponse` |
| DELETE | `/community/posts/:id` | — | 204 |
| POST | `/community/posts/:id/like` | — | `LikeResponse` |
| GET | `/community/posts/:id/comments` | `CommentListQuery` | `CommentListResponse` |
| POST | `/community/posts/:id/comments` | `CreateCommentRequest` | `CreateCommentResponse` |
| DELETE | `/community/posts/:id/comments/:commentId` | — | 204 |
| POST | `/community/posts/:id/report` | `CreateReportRequest` | 204 |

### Announcements (`/announcements`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/announcements` | `AnnouncementListQuery` | `AnnouncementListResponse` |
| GET | `/announcements/:id` | — | `AnnouncementDetailResponse` |

### Couple (`/couple`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/couple` | — | `CoupleResponse` |
| POST | `/couple/request` | — | `CreateInviteResponse` |
| POST | `/couple/confirm` | `ConfirmCoupleRequest` | `ConfirmCoupleResponse` |
| PUT | `/couple` | `UpdateCoupleRequest` | `UpdateCoupleResponse` |
| DELETE | `/couple` | — | 204 |

### Family (`/family`)
| 메서드 | 경로 | 요청 타입 | 응답 타입 |
|--------|------|-----------|-----------|
| GET | `/family` | — | `FamilyGroupResponse` |
| POST | `/family` | — | `FamilyGroupResponse` |
| POST | `/family/join` | `JoinFamilyRequest` | `JoinFamilyResponse` |
| DELETE | `/family` | — | 204 |
| DELETE | `/family/members/:memberId` | — | 204 |

## 실행 순서

1. 관련 도메인의 `{domain}.types.ts` 파일 확인
2. 필요한 Base / CRUD 타입 추가 or 수정
3. `index.ts` barrel export 업데이트
4. `packages/utils/src/index.ts` 에도 export 포함 여부 확인

$ARGUMENTS
