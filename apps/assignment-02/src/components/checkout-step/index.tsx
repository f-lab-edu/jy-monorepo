/** @jsxImportSource @emotion/react */
'use client';

import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

import { useValidatedCoupon, useValidatedPaymentMethod } from '@/hooks/use-validated-selection';
import { ApiError, fetchJson } from '@/lib/api-client';
import { issueCompleteToken } from '@/lib/complete-token';
import { calculateDiscountedPrice } from '@/lib/discount';
import {
  couponsQueryOptions,
  paymentMethodsQueryOptions,
  plansQueryOptions,
  userQueryOptions,
} from '@/lib/queries';
import type { CheckoutBody, Subscription } from '@/lib/types';
import { useSubscriptionStore } from '@/store/subscription-store';

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;

// Step4 본문: 지금까지의 선택을 서버 데이터로 재조회해 요약하고, 구독을 확정한다.
// store에는 참조 ID만 있으므로(상태 소유권 원칙) 이름·가격 같은 표시 정보는 전부 여기서 다시 읽는다.
export function CheckoutStep() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 네 쿼리를 한 배치로 묶어 병렬 실행한다.
  // useSuspenseQuery를 여러 번 나열하면 suspend가 직렬화되어 요청 워터폴이 생긴다(CLAUDE.md 규약).
  const [{ data: plans }, { data: user }, { data: paymentMethods }, { data: coupons }] =
    useSuspenseQueries({
      queries: [
        plansQueryOptions,
        userQueryOptions,
        paymentMethodsQueryOptions,
        couponsQueryOptions,
      ],
    });

  const planId = useSubscriptionStore((state) => state.planId);

  // 영속 ID 무효화 방어는 훅이 수행한다 — 무효 ID는 클리어되고 null이 돌아온다.
  // 카드가 클리어되면 StepGuard가 /payment로 되돌리고, 쿠폰은 선택 사항이라 미적용으로 계속 진행한다.
  const paymentMethod = useValidatedPaymentMethod(paymentMethods);
  const coupon = useValidatedCoupon(coupons);

  const checkout = useMutation({
    mutationFn: (body: CheckoutBody) =>
      fetchJson<Subscription>('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // 완료 토큰 규약: reset()은 여기서 부르지 않는다 — 이 화면의 StepGuard가 빈 store를
      // 보고 /plans로 가로채 /complete 이동이 무산된다. 토큰 소비와 reset은 /complete 몫.
      issueCompleteToken();
      router.replace('/complete');
    },
    onError: (error) => {
      // 400 = 서버 ID 재검증 실패(선택 만료). 목록을 다시 받아 위 방어 로직이 정리하게 한다.
      if (error instanceof ApiError && error.status === 400) {
        void queryClient.invalidateQueries();
      }
    },
  });

  const plan = plans.find(({ id }) => id === planId);

  // 시드 플랜·쿠폰 id는 고정 상수라 실제로 만료될 수 있는 건 카드뿐이다(등록 카드는 재시작 시 소실).
  // 카드가 만료된 프레임은 훅이 클리어 → StepGuard redirect로 곧 사라지므로 그리지 않는다.
  if (!plan || !paymentMethod) return null;

  const finalPrice = calculateDiscountedPrice(plan.pricePerMonth, coupon);

  const errorMessage = !checkout.isError
    ? null
    : checkout.error instanceof ApiError && checkout.error.status === 400
      ? `선택하신 정보가 만료되었습니다 — ${checkout.error.message}`
      : checkout.error instanceof Error
        ? checkout.error.message
        : '구독 처리에 실패했습니다.';

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      <Section title="플랜">
        <SummaryRow label={`${plan.name} 플랜`} value={won(plan.pricePerMonth)} />
        <p css={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{plan.description}</p>
      </Section>

      <Section title="프로필">
        <SummaryRow label="이름" value={user.name} />
        <SummaryRow label="이메일" value={user.email} />
        <SummaryRow label="휴대폰" value={user.phone} />
      </Section>

      <Section title="결제 수단">
        <SummaryRow label={paymentMethod.brand} value={paymentMethod.maskedCardNumber} />
      </Section>

      <Section title="결제 금액">
        <SummaryRow label="월 요금" value={won(plan.pricePerMonth)} />
        {coupon && (
          <SummaryRow
            label={coupon.name}
            value={`-${won(plan.pricePerMonth - finalPrice)}`}
            accent
          />
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
      </Section>

      {errorMessage && (
        <p
          role="alert"
          css={{
            margin: 0,
            padding: '12px 14px',
            borderRadius: 8,
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        disabled={checkout.isPending}
        onClick={() =>
          checkout.mutate({
            planId: plan.id,
            paymentMethodId: paymentMethod.id,
            couponId: coupon?.id ?? null,
          })
        }
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
        {checkout.isPending ? '구독 처리 중…' : '구독하기'}
      </button>
    </div>
  );
}

// 요약 화면 전용 로컬 조각들(재사용 범위가 이 화면뿐이라 밖으로 빼지 않는다).
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 css={{ margin: 0, fontSize: 15, color: '#374151' }}>{title}</h2>
      {children}
    </section>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div css={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span css={{ color: '#6b7280' }}>{label}</span>
      <span css={{ color: accent ? '#2563eb' : '#111827' }}>{value}</span>
    </div>
  );
}
