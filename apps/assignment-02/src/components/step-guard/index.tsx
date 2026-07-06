'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useHydrated } from '@/hooks/use-hydrated';
import { canEnterStep, firstIncompleteStep, STEP_PATHS, type FunnelStep } from '@/lib/funnel';
import { useSubscriptionStore } from '@/store/subscription-store';

// 선행 스텝을 건너뛴 직접 진입(URL 직접 입력·뒤로가기 꼬임)을
// 가장 앞선 미완료 스텝으로 돌려보내는 가드.
// persist 복원 전에는 판단하지 않는다 — SSR 초기값(null)으로 오판 redirect 방지.
export function StepGuard({ step, children }: { step: FunnelStep; children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const planId = useSubscriptionStore((state) => state.planId);
  const profileCompleted = useSubscriptionStore((state) => state.profileCompleted);
  const paymentMethodId = useSubscriptionStore((state) => state.paymentMethodId);

  const selection = { planId, profileCompleted, paymentMethodId };
  const allowed = canEnterStep(step, selection);
  const redirectPath = STEP_PATHS[firstIncompleteStep(selection)];

  useEffect(() => {
    if (hydrated && !allowed) {
      router.replace(redirectPath);
    }
  }, [hydrated, allowed, redirectPath, router]);

  // 복원 전(판단 유보)과 redirect 대기 중에는 화면을 그리지 않는다.
  if (!hydrated || !allowed) return null;
  return <>{children}</>;
}
