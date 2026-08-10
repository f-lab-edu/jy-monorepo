# assignment-03 — 독서 기록 Multi Step Form

> 루트 `CLAUDE.md`(모노레포 공통 규칙)와 중복하지 않는다. 여기엔 **이 앱 고유의 맥락·결정**만 적는다.

## 과제 요구사항

5단계 멀티 스텝 폼으로 독서 기록을 작성한다.

| 단계 | 내용 |
| --- | --- |
| Step1 | 도서 기본 정보, 독서 상태(읽고 싶은 책/읽는 중/읽음/보류 중), 독서 시작일·종료일 |
| Step2 | 도서 추천 여부, 별점(0~5, 0.5 스케일) |
| Step3 | 독후감 |
| Step4 | 인용구 |
| Step5 | 공개 여부 |

### 유효성 규칙

- **독서 상태 × 독서 기간**
  - `읽고 싶은 책`: 독서 기간 입력 금지
  - `읽는 중` / `보류 중`: 시작일만 입력 (종료일 입력 금지)
  - `읽음`: 시작일·종료일 모두 필수
- **독서 기간**: 시작일 ≤ 종료일, 시작일은 도서 출판일 이후
- **별점 × 독후감**: 별점이 1점 또는 5점이면 독후감 최소 100자 필수. 2~4점이면 독후감 선택
- **인용구**: 페이지 번호 < 도서 전체 페이지 수

### 심화 요구사항

- 새로고침해도 폼 상태 유지
- 폼 정보 기반 실시간 미리보기 앱 화면 (500ms 디바운스 후 반영, viewport 1024px 미만이면 미노출 — resize 이벤트 수신)
- 유효성 실패 시: 순서상 첫 실패 필드로 focus + 실패 필드 전체 붉은 아웃라인 + 인풋 하단 에러 메시지
- 인용구 다중 등록/삭제 (`useFieldArray`). 인용구 2개 이상이면 모든 페이지 번호 인풋 required(숫자만, 페이지 수 미만), 1개 이하면 optional
- `CommaSeparatedInput` 설계 → RHF 매핑 export (`RHFCommaSeparatedInput`): 숫자만 입력, 1000단위 콤마 자동 삽입, 사용처에서는 `number`로 수신
- Suspense 유발 목록 API 응답으로 `AutoComplete` Option 구성 + RHF 화 (로딩바 / rejectedFallback + 서버 에러 메시지 / 정상 시 AutoComplete 노출)

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
| --- | --- | --- |
| Router | **App Router** | 과제 명세는 Pages Router를 지정했으나 명세 작성 시점의 레거시 스펙으로 판단, 기존 앱들과 통일하기로 사용자 결정(2026-08-10). `@jy/next-runtime`(emotion-registry·query-provider) 그대로 재사용. |
| css prop | 파일별 pragma (assignment-01·02와 동일) | 전역 `jsxImportSource`는 RSC와 충돌. css prop 우선 컨벤션 승계. |
| 전역 스타일 | `GlobalStyles` 클라이언트 컴포넌트 (리셋만) | assignment-02의 MobileShell 패턴 승계하되, 이 과제는 1024px 이상에서 미리보기가 옆에 붙는 데스크톱 레이아웃이라 480px 프레임은 미승계. 화면 골격은 설계 확정 후 결정. |
| 서버 상태 | TanStack Query (`@jy/next-runtime/query-provider` 재사용) | AutoComplete 목록 API(Suspense) 등 서버 통신에 사용. |
| 폼 | react-hook-form | 과제 명세 지정. `useFieldArray`, RHF 래핑 컴포넌트가 핵심 학습 포인트. |
| jotai | **필요 시점에만 도입** (스캐폴딩 제외) | 과제 명세의 "(필요할때만)" 조건. RHF가 폼 상태를 소유하므로 필요성 입증 전 추가 금지. |

## 설계 결정 (2026-08-10 확정)

과제의 "고민 포인트"에 대한 결정. 근거 포함.

| 항목 | 결정 |
| --- | --- |
| 검증 시점 | **하이브리드** — "다음" 클릭 시 현재 스텝 필드만 `trigger`, 최종 제출 시 전체 재검증. 스텝 간 의존성(별점↔독후감, 페이지 수↔인용구 페이지)이 있어 뒤로 가서 값을 바꾸면 통과한 스텝이 소급 무효가 되므로 최종 관문이 필수. |
| 검증 메시지 | 첫 실패 필드 focus(`shouldFocusError`) + 실패 필드 붉은 아웃라인 + 인풋 하단 메시지. `mode: 'onSubmit'` + `reValidateMode: 'onChange'` — 입력 중엔 조용히, "다음" 클릭 후엔 즉시 재평가. |
| 스텝 상태 | **단일 페이지 + `?step=N` 쿼리 파라미터.** 단일 RHF FormProvider가 5스텝을 관통해야 하므로 라우트 분리(assignment-02 방식)는 언마운트마다 폼 상태를 store로 올려야 해 부적합. 뒤로가기=스텝 이동. 미완료 스텝 직접 진입은 replace 가드. |
| 새로고침 유지 | RHF `watch` 구독 → debounce → **sessionStorage 미러링** + 마운트 시 복원 훅. 폼 상태 소유자는 RHF이므로 jotai(`atomWithStorage`) 도입 근거 없음 — "필요할때만" 조건 유지. |
| 미리보기 | `useWatch` 구독 → **500ms debounce** 후 반영. 1024px 판정은 명세대로 window **resize 이벤트 리스너**(`matchMedia`가 관례지만 명세가 resize 수신을 명시). SSR은 viewport를 모르므로 마운트 전 미렌더(하이드레이션 미스매치 방지). |
| 도서 정보 입력 | 기본 구현은 **수동 입력**(제목·출판일·전체 페이지 수 등). AutoComplete + Suspense 목록 API는 심화 단계에서 교체 — mock API 의존을 뒤로 미뤄 초기 PR을 얇게 유지. |

## PR 분할 로드맵

PR당 500라인 미만, **1 PR = 1 기능**, 머지 후 다음 PR. 테스트는 로직이 생기는 PR부터 동반한다.

| PR | 브랜치 | 내용 |
| --- | --- | --- |
| #1 | `chore/assignment-03-setup` | 앱 스캐폴딩 + 이 CLAUDE.md |
| #2 | `feat/assignment-03-form-shell` | 폼 도메인 타입 + FormProvider + `?step=` 스텝 관리·가드 + 이전/다음 네비게이션 골격 |
| #3 | `feat/assignment-03-step1` | Step1: 도서 기본 정보·독서 상태·독서 기간 + 상태×기간·기간 순서·출판일 검증 |
| #4 | `feat/assignment-03-step2-3` | Step2(추천 여부·별점 0.5 스케일) + Step3(독후감) + 별점×독후감 검증 |
| #5 | `feat/assignment-03-step4` | Step4: 인용구 `useFieldArray` + 페이지 번호 조건부 required 검증 |
| #6 | `feat/assignment-03-step5-submit` | Step5: 공개 여부 + 최종 전체 재검증 + 제출 |
| #7 | `feat/assignment-03-persist` | 새로고침 폼 상태 유지 (sessionStorage 미러링 훅) |
| #8 | `feat/assignment-03-preview` | 실시간 미리보기 (500ms 디바운스 + 1024px resize 컨디셔널) |
| #9 | `feat/assignment-03-comma-input` | `CommaSeparatedInput` + RHF 래핑 export, 전체 페이지 수 인풋 교체 |
| #10 | `feat/assignment-03-autocomplete` | 도서 목록 mock API(Suspense) + `AutoComplete` RHF 화, 수동 입력 대체 |
