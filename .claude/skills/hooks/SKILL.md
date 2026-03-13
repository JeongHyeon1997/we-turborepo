---
name: hooks
description: 컴포넌트 내부의 복잡한 로직(상태, 사이드이펙트, API 호출 등)을 custom hook으로 추출한다. 컴포넌트가 뷰에만 집중할 수 있도록 만든다.
argument-hint: [대상 컴포넌트 파일]
---

# Hooks Skill

컴포넌트 내 로직을 `hooks/` 디렉토리의 custom hook으로 추출한다.

## 추출 대상 판단 기준

- `useState` + `useEffect` 조합이 특정 관심사를 위해 묶여 있는 경우
- API 호출 + 로딩/에러 상태 관리 로직
- 복잡한 이벤트 핸들러 묶음
- 재사용 가능성이 있는 상태 로직

## 규칙

- 파일 위치: `hooks/use{Name}.ts`
- 네이밍: `use` 접두사 필수
- hook은 순수하게 로직만, JSX 반환 금지
- 컴포넌트는 hook 호출 + 반환값 사용만 남겨야 함
- API 호출은 `.then()` 대신 `const {data} = await ...` 패턴 사용
- 단순 fetch (id 기반 조회 등)는 `useCallback`으로 감싼 후 `useEffect`에서 호출
  ```ts
  const fetchFoo = useCallback(async () => {
      try {
          const {data} = await requestFoo(id);
          setFoo(data);
      } catch { setFoo(null); }
  }, [id]);
  useEffect(() => { fetchFoo(); }, [fetchFoo]);
  ```
- 단발성 side-effect (컴포넌트 마운트 시 한 번만)는 IIFE async 패턴 사용
  ```ts
  useEffect(() => {
      (async () => {
          try { const {data} = await requestFoo(); setFoo(data); }
          catch { setFoo(null); }
      })();
  }, []);
  ```

## 실행 순서

1. 컴포넌트에서 추출 가능한 로직 덩어리 파악
2. hook 이름 및 반환 인터페이스 설계
3. 계획 출력 후 확인 요청
4. 승인 후 hook 파일 생성 + 컴포넌트에서 import 교체

## 출력 형식

```
[대상]: {파일명}

추출할 로직:
- use{Name}: {어떤 로직인지}
  반환: { {반환값 목록} }

진행할까요?
```

$ARGUMENTS
