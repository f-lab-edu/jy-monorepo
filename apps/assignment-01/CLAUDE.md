# assignment-01 — 목록 페이지 과제

> 루트 `CLAUDE.md`(모노레포 공통 규칙)와 중복하지 않는다. 여기엔 **이 앱 고유의 맥락·결정**만 적는다.

## 과제 요구사항

- 목록 페이지를 만든다 (데이터 종류는 무관).
- `Suspense`로 로딩 상태를 처리한다.
- `ErrorBoundary`로 에러 상태를 처리한다.
- **페이지네이션 버전**과 **무한스크롤 버전**, 두 개의 목록 페이지를 각각 만든다.
- 목록 페이지에 **검색 기능**을 결합한다 (아래 "검색 방법론" 참고).

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
| --- | --- | --- |
| Router | **App Router** | 최신 표준. RSC 환경에서 Emotion SSR registry를 직접 구성하는 학습 가치. |
| 스타일 SSR | **Emotion registry** (`'use client'` + cache provider) | App Router는 RSC와 Emotion이 충돌하므로 스타일 주입용 registry가 필수. |
| 데이터 페칭 | **TanStack Query** | Suspense·무한스크롤·`enabled`를 1급으로 지원. 과제의 `useQuery`/`refetch`/`enabled` 맥락과 정합. |
| 데이터 소스 | **Rick and Morty API** (`https://rickandmortyapi.com/api`) | 인증 불필요. 페이지네이션(`?page=`)·무한스크롤(`info.next`)·서버 검색(`?name=`)을 한 API로 모두 지원. |

## 데이터 소스 메모 — Rick and Morty API

- 목록 예: `GET /character?page=2&name=rick`
- 응답: `{ info: { count, pages, next, prev }, results: [...] }`
  - 페이지네이션: `info.pages`(총 페이지), `info.count`(총 개수) 사용.
  - 무한스크롤: `info.next`(다음 페이지 URL, 없으면 `null`)를 커서로 사용.
  - 검색: `name` 쿼리. 결과 없으면 **404**를 반환하므로 에러/빈 상태 처리에 유의.

## 페이지 구성

- `/pagination` — 페이지네이션 목록 (+ 검색 방법 A)
- `/infinite` — 무한스크롤 목록 (검색 없음)
- `/search` — 페이지네이션 목록 (+ 검색 방법 B)

> 방법 B는 원래 `/infinite`에 결합할 계획이었으나, 무한스크롤과 `enabled`(빈 검색어 차단)를 결합하면
> 초기 화면이 비는 문제가 있어 **페이지네이션 UI와 결합한 별도 `/search` 페이지**로 분리했다.
> 덕분에 방법 A vs B를 독립 페이지로 나란히 비교할 수 있다.

## 검색 방법론 (학습 포인트)

Search 류 페이지를 만드는 두 가지 방식을, 두 페이지에 하나씩 적용해 비교 학습한다.

### 방법 A — submit 버튼 + RHF `handleSubmit`일 때만 refetch  → `/pagination`

- 제출 시점에만 검색어가 확정되고, 그때만 쿼리가 재실행된다.
- **주의**: 여기에 RHF `watch`를 쓰면 "제출 시에만 fetch"라는 의도와 "값 변화마다 반응"이라는 의도가 **상충**한다. 그래서 `watch` 사용은 잘못된 방법으로 본다.
- 상태 출처는 **URL**(`router.push`). 제출 → URL 변경 → 쿼리 키(`name`) 변경 → 자동 refetch. **Suspense** 기반.

### 방법 B — submit 없이 debounce된 값 + `enabled` 옵션  → `/search`

- 입력값을 debounce하여 쿼리 키로 사용한다.
- 검색어 유무를 `useQuery`의 `enabled` 옵션으로 제어한다 (빈 검색어일 때 불필요한 요청 차단).
- 상태 출처는 **로컬 state**(`useState`). 실시간 입력이라 URL 히스토리를 오염시키지 않기 위함.
- `useSuspenseQuery`는 `enabled`를 지원하지 않으므로 **non-suspense `useQuery`** 를 쓰고 로딩·에러를 반환값으로 직접 처리한다 (방법 A의 Suspense 방식과 대비).

## 코드 작성 원칙 (이 과제에서 특히)

코드 한 줄마다 근거를 점검하며 작성한다.

- 이 코드는 지금 필요한 기능인가?
- 너무 복잡하지 않은가? 읽기 어렵지 않은가?
- 이 코드가 여기에 있는 게 맞는가? (응집도)

## PR 분할 로드맵

PR당 500라인 미만, 1 PR = 1 기능, **머지 후 다음 PR**을 올린다.

| PR | 브랜치 | 내용 |
| --- | --- | --- |
| #1 | `chore/assignment-01-setup` | 앱 스캐폴딩 + 공통 인프라 (Emotion registry, Query Provider, layout, 이 CLAUDE.md) |
| #2 | `feat/assignment-01-pagination` | 페이지네이션 목록 + 공통 ErrorBoundary/Suspense |
| #3 | `feat/assignment-01-infinite-scroll` | 무한스크롤 목록 (#2 공통 컴포넌트 재사용) |
| #4 | `feat/assignment-01-search` | 검색 방법 A(페이지네이션)·B(무한스크롤) 적용 |
