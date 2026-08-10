'use client';

import { useCallback, useEffect } from 'react';

import type { Coupon, PaymentMethod } from '@/lib/types';
import { useSubscriptionStore } from '@/store/subscription-store';

// 영속 ID 무효화 방어(CLAUDE.md 규약)를 한곳에 모은 훅.
// sessionStorage에 남은 선택 ID가 서버 목록에 없으면(예: 서버 재시작으로 인메모리 db 초기화)
// 선택을 클리어하고, 화면에는 검증된 엔티티만 돌려준다.
// 클리어 이후의 이동은 각 화면의 StepGuard가 담당한다(훅은 redirect하지 않는다).

/** 목록에서 ID를 찾아 검증하고, 없으면(무효) clear를 호출한다. 방어 로직의 코어. */
function useValidatedSelection<T extends { id: string }>(
  list: T[],
  selectedId: string | null,
  clear: () => void,
): T | null {
  const selected = list.find(({ id }) => id === selectedId) ?? null;
  const isStale = selectedId !== null && selected === null;

  useEffect(() => {
    if (isStale) clear();
  }, [isStale, clear]);

  return selected;
}

/** 선택된 결제 수단. 무효 ID면 클리어되어 null — 재선택 전까지 다음 단계 진행이 막힌다. */
export function useValidatedPaymentMethod(paymentMethods: PaymentMethod[]): PaymentMethod | null {
  const paymentMethodId = useSubscriptionStore((state) => state.paymentMethodId);
  const clearPaymentMethod = useSubscriptionStore((state) => state.clearPaymentMethod);
  return useValidatedSelection(paymentMethods, paymentMethodId, clearPaymentMethod);
}

/** 선택된 쿠폰. 쿠폰은 선택 사항이라 무효 ID여도 미적용(null)으로 비우고 계속 진행한다. */
export function useValidatedCoupon(coupons: Coupon[]): Coupon | null {
  const couponId = useSubscriptionStore((state) => state.couponId);
  const selectCoupon = useSubscriptionStore((state) => state.selectCoupon);

  // selectCoupon(null)을 clear 시그니처로 감싼다. 인라인 함수는 렌더마다 참조가 바뀌어
  // 코어 이펙트가 매 렌더 재실행되므로 useCallback으로 참조를 고정한다.
  const clearCoupon = useCallback(() => selectCoupon(null), [selectCoupon]);
  return useValidatedSelection(coupons, couponId, clearCoupon);
}
