import { PaymentStep } from '@/components/payment-step';
import { StepBoundary } from '@/components/step-boundary';
import { StepGuard } from '@/components/step-guard';
import { StepHeader } from '@/components/step-header';

// Step3 — 결제 수단·쿠폰 선택. 플랜 선택과 프로필 완료를 마쳐야 진입할 수 있다.
export default function PaymentPage() {
  return (
    <StepGuard step="payment">
      <StepHeader step="payment" />
      <StepBoundary fallback={<p>결제 정보를 불러오는 중…</p>}>
        <PaymentStep />
      </StepBoundary>
    </StepGuard>
  );
}
