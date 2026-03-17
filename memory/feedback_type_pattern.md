---
name: API 타입 선언 패턴
description: 사용자가 선호하는 API 타입 선언 방식 — Base 타입 → CRUD 파생 패턴
type: feedback
---

Base 타입을 DB 테이블 구조와 1:1 로 선언하고, CRUD에서 달라지는 경우 상속/유틸리티 타입으로 파생한다.

**Why:** 사용자가 직접 명시한 선호 방식. 테이블 구조 변경 시 Base만 수정하면 파생 타입이 자동으로 따라온다.

**How to apply:**
- Base 타입: `{Entity}Base extends Timestamps` — DB 컬럼과 1:1, nullable은 `T | null`
- Create 요청: `Omit<Base, 'id' | 'userId' | 'createdAt' | 'updatedAt'>`
- Update 요청: `Partial<CreateRequest>`
- 민감 필드 제거: `Omit<Base, 민감컬럼>`
- 타입 파일 위치: `packages/utils/src/types/{domain}.types.ts`
- 새 타입 추가 시 반드시 `types/index.ts` barrel export 업데이트
