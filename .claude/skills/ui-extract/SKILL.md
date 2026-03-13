---
name: ui-extract
description: 여러 Screen/Page에서 재사용 가능한 컴포넌트를 추출한다. 앱 내부 재사용은 components/ui/로, 앱 간 공유가 필요하면 packages/로 올린다. 단, packages/ui는 React Native 전용이므로 Web 컴포넌트는 packages/ui에 올릴 수 없다.
argument-hint: [대상 컴포넌트 파일]
---

# UI Extract Skill

재사용 가능한 컴포넌트를 적절한 위치로 추출한다.

## 추출 위치 결정

| 상황 | 위치 |
|------|------|
| 같은 앱 내에서만 재사용 | `{앱}/src/components/ui/` |
| 여러 Expo 앱에서 공유 | `packages/ui/` (React Native 전용) |
| 여러 Web 앱에서 공유 | Web 전용 공유 패키지 별도 생성 필요 |

> **주의**: `packages/ui`는 `react-native` peer dependency를 가지므로 Web 컴포넌트는 올릴 수 없다.

## 재사용 가능 판단 기준

- 특정 도메인 로직(API 호출, 특정 store 의존)이 없는 순수 UI 컴포넌트
- 2개 이상의 Screen/Page에서 사용되거나 사용될 가능성이 높은 것
- 예: Card, Badge, EmptyState, Skeleton, Avatar 등

## 규칙

- 이동 위치: `components/ui/{ComponentName}.tsx`
- `components/ui/index.ts` barrel export에 반드시 추가
- 도메인 의존성(특정 store, 특정 API 타입 등)이 있으면 ui/로 이동 불가 → features/에 유지

## 실행 순서

1. 컴포넌트의 의존성 확인 (props, import 목록)
2. 플랫폼 확인 (Expo / Web) 및 재사용 범위 판단
3. 추출 위치 결정
4. 이동 계획 출력 후 확인 요청
5. 승인 후 파일 이동 + index.ts 업데이트

## 출력 형식

```
[대상]: {ComponentName} (Expo / Web)

재사용 가능 여부: O / X
이유: {판단 근거}

추출 위치: {앱}/src/components/ui/ 또는 packages/ui/
이동: {현재 경로} → {추출 위치}/{ComponentName}.tsx
index.ts 추가: export { default as {ComponentName} } from './{ComponentName}'

진행할까요?
```

$ARGUMENTS
