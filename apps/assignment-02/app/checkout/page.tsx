import { CheckoutStep } from '@/components/checkout-step';
import { StepBoundary } from '@/components/step-boundary';
import { StepGuard } from '@/components/step-guard';
import { StepHeader } from '@/components/step-header';

// Step4 — 최종 확인. 플랜·프로필·결제 수단을 모두 마쳐야 진입할 수 있다.
export default function CheckoutPage() {
  return (
    <StepGuard step="checkout">
      <StepHeader step="checkout" />
      <StepBoundary fallback={<p>주문 요약을 불러오는 중…</p>}>
        <CheckoutStep />
      </StepBoundary>
    </StepGuard>
  );
}
