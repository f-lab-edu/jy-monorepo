import { ProfileForm } from '@/components/profile-form';
import { StepBoundary } from '@/components/step-boundary';
import { StepGuard } from '@/components/step-guard';
import { StepHeader } from '@/components/step-header';

// Step2 — 프로필 확인·수정. 플랜을 골라야(planId 존재) 진입할 수 있다.
export default function ProfilePage() {
  return (
    <StepGuard step="profile">
      <StepHeader step="profile" />
      <StepBoundary fallback={<p>프로필을 불러오는 중…</p>}>
        <ProfileForm />
      </StepBoundary>
    </StepGuard>
  );
}
