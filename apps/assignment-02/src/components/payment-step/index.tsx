/** @jsxImportSource @emotion/react */
'use client';

import { useSuspenseQueries } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CardRegisterModal } from '@/components/card-register-modal';
import { CouponSelect } from '@/components/coupon-select';
import { PaymentMethodCard } from '@/components/payment-method-card';
import { calculateDiscountedPrice } from '@/lib/discount';
import { STEP_PATHS } from '@/lib/funnel';
import { couponsQueryOptions, paymentMethodsQueryOptions, plansQueryOptions } from '@/lib/queries';
import { useSubscriptionStore } from '@/store/subscription-store';

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;

// Step3 본문: 카드 선택 + 새 카드 등록 + 쿠폰 선택으로 결제 금액을 확정한다.
export function PaymentStep() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  // 세 쿼리를 한 배치로 묶어 병렬 실행한다.
  // useSuspenseQuery를 여러 번 나열하면 suspend가 직렬화되어 요청 워터폴이 생긴다.
  const [{ data: paymentMethods }, { data: coupons }, { data: plans }] = useSuspenseQueries({
    queries: [paymentMethodsQueryOptions, couponsQueryOptions, plansQueryOptions],
  });

  const planId = useSubscriptionStore((state) => state.planId);
  const paymentMethodId = useSubscriptionStore((state) => state.paymentMethodId);
  const couponId = useSubscriptionStore((state) => state.couponId);
  const selectPaymentMethod = useSubscriptionStore((state) => state.selectPaymentMethod);
  const clearPaymentMethod = useSubscriptionStore((state) => state.clearPaymentMethod);
  const selectCoupon = useSubscriptionStore((state) => state.selectCoupon);

  // 영속 ID 무효화 방어: sessionStorage에 남은 카드 ID가 서버 목록에 없으면
  // (예: 서버 재시작으로 인메모리 db가 seed로 초기화) 선택을 버리고 다시 고르게 한다.
  const isStaleSelection =
    paymentMethodId !== null && !paymentMethods.some(({ id }) => id === paymentMethodId);

  useEffect(() => {
    if (isStaleSelection) clearPaymentMethod();
  }, [isStaleSelection, clearPaymentMethod]);

  const selectedPlan = plans.find(({ id }) => id === planId);
  const selectedCoupon = coupons.find(({ id }) => id === couponId) ?? null;
  const originalPrice = selectedPlan?.pricePerMonth ?? 0;
  // 서버(checkout)와 같은 순수 함수를 써서 표시 금액과 청구 금액이 어긋나지 않게 한다.
  const finalPrice = calculateDiscountedPrice(originalPrice, selectedCoupon);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <section css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 css={sectionTitle}>결제 수단</h2>
        {paymentMethods.length === 0 ? (
          <p css={{ margin: 0, color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
            등록된 카드가 없습니다. 새 카드를 등록해 주세요.
          </p>
        ) : (
          <div
            role="radiogroup"
            aria-label="결제 수단"
            css={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {paymentMethods.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod.id}
                paymentMethod={paymentMethod}
                selected={paymentMethod.id === paymentMethodId}
                onSelect={selectPaymentMethod}
              />
            ))}
          </div>
        )}
        <button type="button" onClick={() => setModalOpen(true)} css={secondaryButton}>
          + 새 카드 등록
        </button>
      </section>

      <section css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 css={sectionTitle}>쿠폰</h2>
        <CouponSelect coupons={coupons} couponId={couponId} onSelect={selectCoupon} />
      </section>

      <section css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 css={sectionTitle}>결제 금액</h2>
        <PriceRow label={selectedPlan ? `${selectedPlan.name} 플랜` : '플랜'} value={won(originalPrice)} />
        {selectedCoupon && (
          <PriceRow label={selectedCoupon.name} value={`-${won(originalPrice - finalPrice)}`} accent />
        )}
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: '1px solid #e5e7eb',
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          <span>월 결제 금액</span>
          <span>{won(finalPrice)}</span>
        </div>
      </section>

      <button
        type="button"
        disabled={paymentMethodId === null || isStaleSelection}
        onClick={() => router.push(STEP_PATHS.checkout)}
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
        완료
      </button>

      <CardRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegistered={selectPaymentMethod}
      />
    </div>
  );
}

const sectionTitle = { margin: 0, fontSize: 15, color: '#374151' } as const;

const secondaryButton = {
  padding: '12px 0',
  borderRadius: 8,
  border: '1px dashed #9ca3af',
  backgroundColor: '#fff',
  color: '#374151',
  fontSize: 15,
  cursor: 'pointer',
} as const;

function PriceRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div css={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span css={{ color: '#6b7280' }}>{label}</span>
      <span css={{ color: accent ? '#2563eb' : '#111827' }}>{value}</span>
    </div>
  );
}
