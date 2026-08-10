import { useEffect } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * 에러가 있는 필드만 값 변경 시 재검증하는 폼 일반 정책 훅.
 *
 * RHF의 reValidateMode('onChange')는 handleSubmit 이후(isSubmitted)에만 동작하는데,
 * 멀티 스텝 폼처럼 handleSubmit 대신 trigger로 검증하는 폼에서는 자동 재검증이
 * 일어나지 않는다. 이 훅이 그 공백을 메운다.
 *
 * - 에러 없는 필드는 건드리지 않는다 — "입력 중엔 조용히, 검증 후엔 즉시 재평가" 유지.
 * - 어떤 값이 바뀌어도 에러난 필드 전체를 재검증하므로 교차 필드 규칙
 *   (예: 별점 변경 → 독후감 에러 재평가)도 함께 갱신된다.
 * - trigger는 값을 바꾸지 않으므로 watch 콜백을 재발화시키지 않는다(루프 없음).
 */
export function useErroredFieldsRevalidation<TFieldValues extends FieldValues>(
  methods: UseFormReturn<TFieldValues>,
) {
  const { trigger, watch } = methods;

  useEffect(() => {
    const subscription = watch(() => {
      const errored = Object.keys(methods.formState.errors) as FieldPath<TFieldValues>[];
      if (errored.length > 0) void trigger(errored);
    });
    return () => subscription.unsubscribe();
  }, [methods, trigger, watch]);
}
