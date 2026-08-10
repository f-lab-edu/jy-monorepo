/** @jsxImportSource @emotion/react */
'use client';

import { useEffect } from 'react';
import { FormProvider, useForm, type FieldPath } from 'react-hook-form';

import { getStepConfig, TOTAL_STEPS } from '@/components/record-form/step-config';
import { StepNavigation } from '@/components/step-navigation';
import { useFunnelStep } from '@/hooks/use-funnel-step';
import { DEFAULT_FORM_VALUES, type ReadingRecordFormValues } from '@/lib/reading-record';

// 5스텝을 관통하는 단일 폼 컨테이너. FormProvider가 스텝 전환에도 언마운트되지 않아
// 폼 값이 그대로 유지된다 — 라우트 분리 대신 ?step= 쿼리 파라미터를 쓰는 이유.
// 개별 스텝의 내용은 step-config 레지스트리가 소유하고, 여기서는 조회만 한다.
export function RecordForm() {
  const { step, goNext, goPrev } = useFunnelStep(TOTAL_STEPS);
  const methods = useForm<ReadingRecordFormValues>({
    // 입력 중엔 조용히, "다음" 클릭 후엔 onChange로 즉시 재평가한다.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const { trigger, watch } = methods;

  // reValidateMode('onChange')는 handleSubmit 이후(isSubmitted)에만 동작하는데,
  // 스텝별 검증은 handleSubmit이 아닌 trigger를 쓰므로 자동 재검증이 일어나지 않는다.
  // 에러가 있는 필드만 값 변경 시 직접 재검증해 "다음 클릭 후 즉시 재평가" 정책을 구현한다.
  // (에러 없는 필드는 건드리지 않아 "입력 중엔 조용히"도 유지된다)
  useEffect(() => {
    const subscription = watch(() => {
      const errored = Object.keys(
        methods.formState.errors,
      ) as FieldPath<ReadingRecordFormValues>[];
      if (errored.length > 0) void trigger(errored);
    });
    return () => subscription.unsubscribe();
  }, [methods, trigger, watch]);

  const { title, description, fields, Content } = getStepConfig(step);

  // "다음": 현재 스텝 필드만 검증하고 통과 시 이동. 실패 시 첫 실패 필드로 focus.
  const handleNext = async () => {
    const valid = fields.length === 0 || (await trigger([...fields], { shouldFocus: true }));
    if (valid) goNext();
  };

  return (
    <FormProvider {...methods}>
      <section css={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <p css={{ fontSize: 14, color: '#888', margin: '0 0 24px' }}>
          {step} / {TOTAL_STEPS}
        </p>
        <h2 css={{ fontSize: 22, margin: '0 0 4px' }}>{title}</h2>
        <p css={{ fontSize: 15, lineHeight: 1.6, color: '#555', margin: '0 0 24px' }}>
          {description}
        </p>
        {Content ? (
          <Content />
        ) : (
          <p css={{ padding: '16px 0', color: '#9ca3af', margin: 0 }}>
            이 단계의 입력 필드는 이후 PR에서 구현됩니다.
          </p>
        )}
        <StepNavigation step={step} totalSteps={TOTAL_STEPS} onPrev={goPrev} onNext={handleNext} />
      </section>
    </FormProvider>
  );
}
