# assignment-02 — 구독 서비스 (모바일)

> 루트 `CLAUDE.md`(모노레포 공통 규칙)와 중복하지 않는다. 여기엔 **이 앱 고유의 맥락·결정**만 적는다.

## 과제 요구사항

5단계 구독 퍼널. 모바일 우선 UI(최대폭 480px 중앙 프레임).

| 단계 | 화면 | 서버 통신 |
| --- | --- | --- |
| 인트로 | 서비스 소개 + 시작 | — |
| Step1 PlanSelection | 플랜 목록 → 선택 | GET `/api/subscriptions` |
| Step2 ProfileForm | 프로필 조회·수정 (로그인 가정) | GET/**PUT** `/api/user` (즉시 저장) |
| Step3 Payment | 카드 목록·선택 + 등록 모달 + 쿠폰 | GET/POST `/api/payment-methods`, GET `/api/coupons` |
| Step4 Checkout | 전체 요약 + 구독 완료 | POST `/api/subscriptions/checkout` |
| Step5 Complete | 완료 화면 | — |

**제약**: ProfileForm(PUT) 제외 완료 전 서버 저장 금지 / 뒤로가기·새로고침에도 폼 값 유지 / 카드 16자리 유효성 + 마지막 4자리 `*` masking / 정률(%)·정액(원) 쿠폰 / 카드 POST 후 invalidate.

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
| --- | --- | --- |
| Router | **App Router** | assignment-01과 동일. `@jy/next-runtime`의 Emotion registry·Query Provider 재사용. |
| 클라이언트 상태 | **Zustand + `persist`(sessionStorage)** | 새로고침 영속 요구. SSR 하이드레이션을 미들웨어가 처리. |
| Mock API | **Route Handlers** (`app/api/*`) + 인메모리 db(`globalThis` 싱글턴) | 실제 HTTP 왕복 재현. 서버 재시작 시 초기화는 과제 목적상 허용. |
| 서버 상태 | TanStack Query — 이번 과제는 **mutation + invalidation**이 핵심 학습 포인트 | assignment-01은 조회만 다룸. |
| 라우팅 | 스텝별 라우트(`/plans` `/profile` `/payment` `/checkout` `/complete`) + 클라이언트 스텝 가드 | 브라우저 뒤로가기 자연 지원. |
| 스타일 | **`css` prop 우선** (assignment-01 예외 승계, 파일별 pragma) | 리뷰 피드백 반영. `*.styles.ts` 없음. |

## 상태 소유권 원칙 (핵심 설계)

- **서버 소유 (TanStack Query)**: 플랜·프로필·카드·쿠폰 목록. 프로필은 Step2에서 PUT 즉시 반영되므로 store에 복제하지 않는다.
- **클라이언트 소유 (Zustand persist)**: `planId` / `profileCompleted` / `paymentMethodId` / `couponId` — **선택(참조 ID)만 저장**하고 엔티티 원본은 저장하지 않는다(stale 복제 방지). Checkout에서 ID로 서버 데이터를 재조회해 요약한다.
- 카드번호 원본 등 민감 데이터는 어떤 storage에도 저장하지 않는다. 마스킹은 서버(POST 처리 시)가 수행.

## 상태 전이 규약 (구현 시 반드시 준수)

- **하이드레이션 가드**: persist 복원 완료 전에는 스텝 가드·"이어서 진행" 판단을 유보한다(`useHydrated` 훅, `onFinishHydration` 구독). SSR 첫 렌더의 초기값으로 오판 redirect 금지.
- **완료 토큰 규약**: 완료 신호는 store에 넣지 않는다(`reset()`이 지워버림). checkout `onSuccess` → sessionStorage 별도 키에 토큰 write → `/complete` replace → 마운트에서 토큰 확인 후 렌더 + **그 자리에서 토큰 소비 + `reset()`**. `/complete` 새로고침 시 `/`로 replace는 의도된 동작.
- **영속 ID 무효화 방어**: dev 서버 재시작으로 인메모리 db가 리셋되면 store의 ID가 dangling이 된다. 조회 목록에 없는 ID는 선택을 클리어하고 가장 앞선 미완료 스텝으로 replace. checkout 400도 "선택 만료" 배너로 흡수.
- **Checkout 쿼리 병렬화**: 다중 `useSuspenseQuery` 나열은 순차 워터폴이 되므로 **`useSuspenseQueries` 단일 배치**를 쓴다.
- checkout Route Handler는 ID 재검증 + **서버 측 가격 재계산**(클라이언트 가격 신뢰 금지). 할인 계산은 순수 함수(`calculateDiscountedPrice`)를 서버·클라이언트가 공유. 정률은 원 단위 내림, 정액은 0원 하한.

## 스텝 가드

| 페이지 | 진입 조건 | 미충족 시 |
| --- | --- | --- |
| `/plans` | 없음 | — |
| `/profile` | `planId` 존재 | `/plans` replace |
| `/payment` | + `profileCompleted` | `/profile` replace |
| `/checkout` | + `paymentMethodId` 존재 | `/payment` replace |
| `/complete` | 완료 토큰 존재 | `/` replace |

## PR 분할 로드맵

PR당 500라인 미만, **1 PR = 1 기능**, 머지 후 다음 PR.

| PR | 브랜치 | 내용 |
| --- | --- | --- |
| #1 | `chore/assignment-02-setup` | 앱 스캐폴딩 + 인프라(layout·provider·MobileShell) + 인트로 + 이 CLAUDE.md |
| #2 | `feat/assignment-02-mock-api` | 도메인 타입 + 인메모리 db + Route Handlers 5종 |
| #3 | `feat/assignment-02-plan-selection` | Zustand store + persist + useHydrated + StepGuard + Step1 |
| #4 | `feat/assignment-02-profile` | Step2 (RHF + PUT mutation + invalidation) |
| #5 | `chore/assignment-02-test-setup` | Vitest + RTL 부트스트랩 + turbo `test` 태스크 |
| #6 | `feat/assignment-02-payment-methods` | Step3 카드 목록/선택 + 빈 상태 + 무효 ID 방어 |
| #7 | `feat/assignment-02-card-register` | 카드 등록 모달(`<dialog>`) + 유효성·마스킹 (+ 테스트) |
| #8 | `feat/assignment-02-coupon-checkout` | 쿠폰 + 할인 계산 + Step4/5 + 완료 토큰 (+ 테스트) |

## 미결 사항 (멘토 확인 필요)

1. **마스킹 방향** — 명세 문구대로 "마지막 4자리 masking"(`1234 5678 9012 ****`) 채택 중. 통상 관례(마지막 4자리만 노출)와 반대. `maskCardNumber` 한 곳만 수정하면 전환 가능.
2. **"폼 값 유지" 범위** — 퍼널 선택값 유지(현재 해석)인지, 프로필 미저장 draft까지 새로고침 보존인지.
3. **쿠폰 적용 대상** — 월 요금 1회분 기준으로 가정.
