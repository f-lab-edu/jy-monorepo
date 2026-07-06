import { PlanSelection } from '@/components/plan-selection';
import { StepBoundary } from '@/components/step-boundary';
import { StepGuard } from '@/components/step-guard';
import { StepHeader } from '@/components/step-header';

// Step1 — 플랜 선택. plans는 진입 조건이 없지만, 모든 스텝이 같은 구조
// (Guard → Header → Boundary → 본문)를 갖도록 통일해 페이지마다 읽는 방식이 달라지지 않게 한다.
export default function PlansPage() {
  return (
    <StepGuard step="plans">
      <StepHeader step="plans" />
      <StepBoundary fallback={<p>플랜 목록을 불러오는 중…</p>}>
        <PlanSelection />
      </StepBoundary>
    </StepGuard>
  );
}
