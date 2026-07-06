/** @jsxImportSource @emotion/react */
'use client';

import Link from 'next/link';

import { useHydrated } from '@/hooks/use-hydrated';
import { firstIncompleteStep, STEP_PATHS } from '@/lib/funnel';
import { useSubscriptionStore } from '@/store/subscription-store';

// 인트로: 서비스 소개 + 구독 시작.
// 진행 중 상태(플랜 선택 이후)가 있으면 마지막 미완료 스텝으로 돌아가는 "이어서 진행"을 함께 보여준다.
export default function IntroPage() {
  const hydrated = useHydrated();
  const planId = useSubscriptionStore((state) => state.planId);
  const profileCompleted = useSubscriptionStore((state) => state.profileCompleted);
  const paymentMethodId = useSubscriptionStore((state) => state.paymentMethodId);

  // persist 복원 전에는 진행 여부를 알 수 없으므로 버튼을 그리지 않는다(오판·깜빡임 방지).
  const inProgress = hydrated && planId !== null;
  const resumePath = STEP_PATHS[firstIncompleteStep({ planId, profileCompleted, paymentMethodId })];

  return (
    <main
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
        minHeight: '100dvh',
        paddingBottom: 80,
      }}
    >
      <h1 css={{ fontSize: 28, margin: 0 }}>구독 서비스</h1>
      <p css={{ fontSize: 16, lineHeight: 1.6, color: '#555', margin: 0 }}>
        플랜 선택부터 결제까지, 4단계로 간단하게 구독을 시작하세요.
      </p>
      <Link
        href="/plans"
        css={{
          display: 'block',
          padding: '14px 0',
          borderRadius: 8,
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          textAlign: 'center',
          textDecoration: 'none',
        }}
      >
        구독 시작하기
      </Link>
      {inProgress && (
        <Link
          href={resumePath}
          css={{
            display: 'block',
            padding: '13px 0',
            borderRadius: 8,
            border: '1px solid #2563eb',
            color: '#2563eb',
            fontSize: 16,
            fontWeight: 600,
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          이어서 진행
        </Link>
      )}
    </main>
  );
}
