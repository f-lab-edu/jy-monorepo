'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { ApiError, fetchJson } from '@/lib/api-client';
import { issueCompleteToken } from '@/lib/complete-token';
import type { CheckoutBody, Subscription } from '@/lib/types';

// Step4의 핵심(종단) 관심사: 구독 확정 오케스트레이션.
// 뷰(index.tsx)는 "무엇을 그릴지"만, 여기는 "확정이 어떻게 진행되는지"만 담당한다.
// 사용처가 CheckoutStep 하나뿐인 화면 전용 훅이라 컴포넌트 폴더에 동거한다
// — 다른 화면이 공유하게 되면 그때 src/hooks/로 승격한다.

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: CheckoutBody) =>
      fetchJson<Subscription>('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // 완료 토큰 규약: reset()은 여기서 부르지 않는다 — 체크아웃 화면의 StepGuard가
      // 빈 store를 보고 /plans로 가로채 /complete 이동이 무산된다. 토큰 소비와 reset은 /complete 몫.
      issueCompleteToken();
      router.replace('/complete');
    },
    onError: (error) => {
      // 400 = 서버 ID 재검증 실패(선택 만료). 목록을 다시 받아
      // use-validated-selection의 방어 로직이 무효 선택을 정리하게 한다.
      if (error instanceof ApiError && error.status === 400) {
        void queryClient.invalidateQueries();
      }
    },
  });

  // 400을 "선택 만료"로 읽는 도메인 해석. onError의 invalidate 판단과 같은 조건이므로
  // 오케스트레이션 옆에 응집시킨다. 그 해석을 어떤 문구로 보여줄지는 뷰의 몫.
  const isSelectionExpired = mutation.error instanceof ApiError && mutation.error.status === 400;

  return { checkout: mutation, isSelectionExpired };
}
