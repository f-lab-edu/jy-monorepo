/** @jsxImportSource @emotion/react */
'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { StepNavigation } from '@/components/step-navigation';
import { StepPlaceholder } from '@/components/step-placeholder';
import { useFunnelStep } from '@/hooks/use-funnel-step';
import { getStepMeta, STEP_FIELDS, TOTAL_STEPS } from '@/lib/funnel-steps';
import { DEFAULT_FORM_VALUES, type ReadingRecordFormValues } from '@/lib/reading-record';

// 5스텝을 관통하는 단일 폼 컨테이너. FormProvider가 스텝 전환에도 언마운트되지 않아
// 폼 값이 그대로 유지된다 — 라우트 분리 대신 ?step= 쿼리 파라미터를 쓰는 이유.
export function RecordForm() {
  const { step, goNext, goPrev } = useFunnelStep();
  const methods = useForm<ReadingRecordFormValues>({
    // 입력 중엔 조용히, "다음" 클릭 후엔 onChange로 즉시 재평가한다.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { title, description } = getStepMeta(step);

  // "다음": 현재 스텝 필드만 검증하고 통과 시 이동. 실패 시 첫 실패 필드로 focus.
  const handleNext = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    const valid = fields.length === 0 || (await methods.trigger(fields, { shouldFocus: true }));
    if (valid) goNext();
  };

  return (
    <FormProvider {...methods}>
      <section css={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <p css={{ fontSize: 14, color: '#888', margin: 0 }}>
          {step} / {TOTAL_STEPS}
        </p>
        <StepPlaceholder title={title} description={description} />
        <StepNavigation step={step} totalSteps={TOTAL_STEPS} onPrev={goPrev} onNext={handleNext} />
      </section>
    </FormProvider>
  );
}
