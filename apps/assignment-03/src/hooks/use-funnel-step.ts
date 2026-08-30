import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// ?step= 쿼리 파라미터 원형을 유효한 스텝 번호로 정규화한다(비숫자·범위 밖 → 1).
function parseStep(raw: string | null, totalSteps: number): number {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > totalSteps) return 1;
  return parsed;
}

/**
 * ?step=N 쿼리 파라미터를 단일 진실(source of truth)로 스텝을 관리한다.
 *
 * - 특정 폼을 모르는 범용 퍼널 훅 — 스텝 구성(개수·내용)은 호출부가 소유하고
 *   totalSteps로만 전달받는다.
 * - 이동은 push라 브라우저 뒤로가기가 그대로 스텝 이동이 된다.
 * - 도달한 적 없는 스텝의 직접 진입(?step=4 붙여넣기 등)은 마지막 도달 스텝으로 replace.
 * - maxReachedStep은 세션 내 상태라 새로고침 시 1로 초기화된다. 복원은 persist PR에서 다룬다.
 */
export function useFunnelStep(totalSteps: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = parseStep(searchParams.get('step'), totalSteps);
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
    const next = Math.min(step + 1, totalSteps);
    setMaxReachedStep((max) => Math.max(max, next));
    goTo(next);
  }, [goTo, step, totalSteps]);

  const goPrev = useCallback(() => {
    if (step > 1) goTo(step - 1);
  }, [goTo, step]);

  // goTo는 뒤 방향 점프(최종 검증 실패 스텝 이동)에 쓴다. 앞 방향은 maxReachedStep 가드가 막는다.
  return { step, goNext, goPrev, goTo };
}
