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

## 설계 미결 사항 (사용자와 결정 후 진행)

과제가 명시한 "고민 포인트" — 설계 단계에서 옵션·리스크 브리핑 후 결정한다.

1. **유효성 검증 시점** — 각 단계에서 vs 마지막 단계에서
2. **유효성 메시지 노출 방식**
3. **스텝 상태를 쿼리 파라미터로 관리할지** (vs 클라이언트 상태)
4. **새로고침 유지 전략** — 저장소(sessionStorage/localStorage), 저장 시점, draft 스키마
5. **미리보기 앱 화면 배치와 500ms 반영 구현 방식** (debounce vs subscription)
