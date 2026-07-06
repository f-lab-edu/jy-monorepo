// 퍼널 스텝 순서와 진입 규칙.
// 컴포넌트(StepGuard)와 분리한 순수 로직이라 단위 테스트 대상이다(PR #5 이후).

export const FUNNEL_STEPS = ['plans', 'profile', 'payment', 'checkout'] as const;
export type FunnelStep = (typeof FUNNEL_STEPS)[number];

export const STEP_PATHS: Record<FunnelStep, string> = {
  plans: '/plans',
  profile: '/profile',
  payment: '/payment',
  checkout: '/checkout',
};

/** 진입 판정에 필요한 최소 선택 상태 (store에서 추출) */
export type FunnelSelection = {
  planId: string | null;
  profileCompleted: boolean;
  paymentMethodId: string | null;
};

/** 아직 완료되지 않은 가장 앞선 스텝. 가드의 redirect 목적지이자 "이어서 진행" 목적지. */
export function firstIncompleteStep(selection: FunnelSelection): FunnelStep {
  if (selection.planId === null) return 'plans';
  if (!selection.profileCompleted) return 'profile';
  if (selection.paymentMethodId === null) return 'payment';
  return 'checkout';
}

/** 해당 스텝에 진입 가능한가 — "선행 스텝이 모두 완료됐는가"와 동치. */
export function canEnterStep(step: FunnelStep, selection: FunnelSelection): boolean {
  return FUNNEL_STEPS.indexOf(step) <= FUNNEL_STEPS.indexOf(firstIncompleteStep(selection));
}
