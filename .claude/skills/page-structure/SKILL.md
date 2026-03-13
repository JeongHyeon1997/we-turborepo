---
name: page-structure
description: Screen/Page 컴포넌트가 무거울 때 features/로 분리한다. 모달, 드로어, 섹션 등 큰 뷰 덩어리를 추출하고 Screen/Page는 레이아웃 조합과 상태 연결만 담당하도록 만든다.
argument-hint: [대상 파일]
---

# Page Structure Skill

Screen/Page 컴포넌트를 분해해 `components/features/`로 분리한다.

## 플랫폼별 용어

- **Expo (React Native)**: Screen — `screens/` 하위 파일
- **Vite Web**: Page — `pages/` 또는 `views/` 하위 파일

## 규칙

- 분리 대상: 모달, 드로어, 탭 패널, 카드 섹션 등 독립적으로 의미 있는 뷰 덩어리
- 분리 위치: `components/features/{라우터경로}/{ComponentName}.tsx`
  - 예 (RN): `components/features/mypage/MileageDrawer.tsx`
  - 예 (Web): `components/features/history/HistoryDetailModal.tsx`
- 모달은 반드시 분리된 컴포넌트로 작성
- Screen/Page는 분리 후 레이아웃 조합 + 상태 연결만 남겨야 한다

## 실행 순서

1. 대상 파일을 읽고 플랫폼(Expo / Web) 파악
2. 분리 가능한 덩어리 목록 파악
3. 분리 계획 출력 후 확인 요청
4. 승인 후 파일 생성 및 import 교체

## 출력 형식

```
[대상]: {파일명} (Expo Screen / Web Page)

분리할 덩어리:
- {ComponentName} → components/features/{경로}/{ComponentName}.tsx
  이유: {왜 분리하는지}

진행할까요?
```

$ARGUMENTS
