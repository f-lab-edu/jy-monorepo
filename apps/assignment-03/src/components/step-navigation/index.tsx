/** @jsxImportSource @emotion/react */
'use client';

interface StepNavigationProps {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

const baseButton = {
  flex: 1,
  padding: '13px 0',
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
} as const;

// 이전/다음 네비게이션. 마지막 스텝에서는 onNext가 제출 동작을 담당한다(RecordForm이 분기).
export function StepNavigation({ step, totalSteps, onPrev, onNext }: StepNavigationProps) {
  const isLast = step === totalSteps;

  return (
    <nav css={{ display: 'flex', gap: 12, marginTop: 32 }}>
      {step > 1 && (
        <button
          type="button"
          onClick={onPrev}
          css={{
            ...baseButton,
            border: '1px solid #d1d5db',
            backgroundColor: '#fff',
            color: '#374151',
          }}
        >
          이전
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        css={{
          ...baseButton,
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
        }}
      >
        {isLast ? '작성 완료' : '다음'}
      </button>
    </nav>
  );
}
