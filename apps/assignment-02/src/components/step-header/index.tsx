/** @jsxImportSource @emotion/react */
'use client';

import { FUNNEL_STEPS, type FunnelStep } from '@/lib/funnel';

const STEP_LABELS: Record<FunnelStep, string> = {
  plans: '플랜 선택',
  profile: '프로필 확인',
  payment: '결제 수단',
  checkout: '최종 확인',
};

// 퍼널 공통 헤더. 예: "Step 1/4 · 플랜 선택"
export function StepHeader({ step }: { step: FunnelStep }) {
  const stepNumber = FUNNEL_STEPS.indexOf(step) + 1;

  return (
    <header css={{ padding: '24px 0 8px' }}>
      <p css={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
        Step {stepNumber}/{FUNNEL_STEPS.length}
      </p>
      <h1 css={{ margin: '4px 0 0', fontSize: 22 }}>{STEP_LABELS[step]}</h1>
    </header>
  );
}
