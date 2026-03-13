---
name: constants
description: 컴포넌트 내부에 인라인으로 작성된 변하지 않는 정적 데이터(배열, 객체 등)를 constants/data/로 이동하고 barrel export에 추가한다.
argument-hint: [대상 파일]
---

# Constants Skill

인라인 정적 데이터를 `constants/data/`로 추출한다.

## 추출 대상 판단 기준

- 컴포넌트 외부 또는 내부에 선언된 변하지 않는 배열/객체
- 서버에서 받아오지 않고 코드에 고정된 데이터
- 예: 탭 목록, 카테고리 배열, 메뉴 항목, 코드-레이블 매핑 등

## 규칙

- 이동 위치: `constants/data/{name}.ts`
- `constants/data/index.ts` barrel export에 반드시 추가
- 타입이 필요하면 `types/`에 정의 후 참조

## 실행 순서

1. 대상 파일에서 정적 데이터 목록 파악
2. 이동 위치 및 변수명 결정
3. 계획 출력 후 확인 요청
4. 승인 후 파일 생성 + import 교체 + index.ts 업데이트

## 출력 형식

```
[발견된 정적 데이터]
- {변수명}: {데이터 설명}
  이동 → constants/data/{파일명}.ts

진행할까요?
```

$ARGUMENTS
