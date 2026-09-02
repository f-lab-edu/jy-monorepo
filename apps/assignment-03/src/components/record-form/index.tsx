/** @jsxImportSource @emotion/react */
'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { RecordComplete } from '@/components/record-complete';
import { FUNNEL_STEPS, getStepConfig, TOTAL_STEPS } from '@/components/record-form/step-config';
import { StepNavigation } from '@/components/step-navigation';
import { useErroredFieldsRevalidation } from '@/hooks/use-errored-fields-revalidation';
import { useFunnelStep } from '@/hooks/use-funnel-step';
import { DEFAULT_FORM_VALUES, type ReadingRecordFormValues } from '@/lib/reading-record';

// 5스텝을 관통하는 단일 폼 컨테이너. FormProvider가 스텝 전환에도 언마운트되지 않아
// 폼 값이 그대로 유지된다 — 라우트 분리 대신 ?step= 쿼리 파라미터를 쓰는 이유.
// 개별 스텝의 내용은 step-config 레지스트리가 소유하고, 여기서는 조회만 한다.
export function RecordForm() {
  const { step, goNext, goPrev, goTo } = useFunnelStep(TOTAL_STEPS);
  const methods = useForm<ReadingRecordFormValues>({
    // 입력 중엔 조용히, "다음" 클릭 후엔 onChange로 즉시 재평가한다.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const { trigger, getValues } = methods;

  // 제출 완료 시 폼 대신 완료 화면을 보여준다. 저장 API는 로드맵 밖(완료 화면까지가 이번 범위).
  const [submitted, setSubmitted] = useState<ReadingRecordFormValues | null>(null);
  // 최종 검증 실패로 다른 스텝에 이동한 뒤 focus할 스텝. 언마운트된 인풋은 ref가 없어
  // 이동 → 마운트 완료를 기다렸다가 effect에서 focus해야 한다.
  const [pendingFocusStep, setPendingFocusStep] = useState<number | null>(null);

  // "다음" 클릭 후 즉시 재평가 정책 — 에러난 필드를 고치는 순간 에러를 해제한다.
  useErroredFieldsRevalidation(methods);

  useEffect(() => {
    if (pendingFocusStep === null || step !== pendingFocusStep) return;
    // 이동한 스텝의 인풋이 마운트된 뒤이므로 이제 shouldFocus가 동작한다.
    void trigger([...getStepConfig(step).fields], { shouldFocus: true });
    setPendingFocusStep(null);
  }, [pendingFocusStep, step, trigger]);

  const { title, description, fields, Content } = getStepConfig(step);

  // "다음": 현재 스텝 필드만 검증하고 통과 시 이동. 실패 시 첫 실패 필드로 focus.
  const handleNext = async () => {
    const valid = fields.length === 0 || (await trigger([...fields], { shouldFocus: true }));
    if (valid) goNext();
  };

  // 최종 제출: 스텝 순서대로 전체 재검증. 뒤로 가서 값을 바꾸면 통과했던 스텝이
  // 소급 무효될 수 있어(별점↔독후감, 페이지 수↔인용구) 마지막 관문이 필수다.
  // 실패하면 순서상 첫 실패 스텝으로 이동해 첫 실패 필드에 focus한다.
  const handleSubmit = async () => {
    for (const [index, config] of FUNNEL_STEPS.entries()) {
      if (await trigger([...config.fields])) continue;

      const failedStep = index + 1;
      if (failedStep === step) {
        void trigger([...config.fields], { shouldFocus: true });
      } else {
        goTo(failedStep);
        setPendingFocusStep(failedStep);
      }
      return;
    }
    setSubmitted(getValues());
  };

  if (submitted) return <RecordComplete values={submitted} />;

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
        <StepNavigation
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrev={goPrev}
          onNext={step === TOTAL_STEPS ? handleSubmit : handleNext}
        />
      </section>
    </FormProvider>
  );
}
