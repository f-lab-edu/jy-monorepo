/** @jsxImportSource @emotion/react */
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { PlanCard } from '@/components/plan-card';
import { STEP_PATHS } from '@/lib/funnel';
import { plansQueryOptions } from '@/lib/queries';
import { useSubscriptionStore } from '@/store/subscription-store';

// Step1 본문: 플랜 목록을 라디오 그룹으로 보여주고, 선택해야 다음으로 넘어갈 수 있다.
// 선택 즉시 store(persist)에 기록되므로 새로고침·뒤로가기에도 유지된다.
export function PlanSelection() {
  const router = useRouter();
  const { data: plans } = useSuspenseQuery(plansQueryOptions);
  const planId = useSubscriptionStore((state) => state.planId);
  const selectPlan = useSubscriptionStore((state) => state.selectPlan);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>
      <div
        role="radiogroup"
        aria-label="구독 플랜"
        css={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={plan.id === planId}
            onSelect={selectPlan}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={planId === null}
        onClick={() => router.push(STEP_PATHS.profile)}
        css={{
          padding: '14px 0',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          '&:disabled': { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
        }}
      >
        다음
      </button>
    </div>
  );
}
