import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { parseStep, TOTAL_STEPS } from '@/lib/funnel-steps';

/**
 * ?step=N 쿼리 파라미터를 단일 진실(source of truth)로 스텝을 관리한다.
 *
 * - 이동은 push라 브라우저 뒤로가기가 그대로 스텝 이동이 된다.
 * - 도달한 적 없는 스텝의 직접 진입(?step=4 붙여넣기 등)은 마지막 도달 스텝으로 replace.
 * - maxReachedStep은 세션 내 상태라 새로고침 시 1로 초기화된다. 복원은 persist PR에서 다룬다.
 */
export function useFunnelStep() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = parseStep(searchParams.get('step'));
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  useEffect(() => {
    if (step > maxReachedStep) {
      router.replace(`${pathname}?step=${maxReachedStep}`);
    }
  }, [step, maxReachedStep, pathname, router]);

  const goTo = useCallback(
    (next: number) => {
      router.push(`${pathname}?step=${next}`);
    },
    [pathname, router],
  );

  const goNext = useCallback(() => {
    const next = Math.min(step + 1, TOTAL_STEPS);
    setMaxReachedStep((max) => Math.max(max, next));
    goTo(next);
  }, [goTo, step]);

  const goPrev = useCallback(() => {
    if (step > 1) goTo(step - 1);
  }, [goTo, step]);

  return { step, goNext, goPrev };
}
