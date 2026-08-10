/** @jsxImportSource @emotion/react */
'use client';

import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { fieldInputStyle } from '@/components/form-field/form-field.styles';
import type { ReadingRecordFormValues } from '@/lib/reading-record';
import { requiresReview, REVIEW_MIN_LENGTH, validateReview } from '@/lib/reading-record-rules';

// Step3 — 독후감. 별점(Step2)이 1점 또는 5점이면 100자 이상 필수, 그 외에는 선택.
export function ReviewStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();

  const rating = watch('rating');
  const review = watch('review');
  const required = requiresReview(rating);
  const length = review.trim().length;

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FormField
        label={required ? `독후감 (별점 ${rating}점 — 필수)` : '독후감 (선택)'}
        htmlFor="review"
        error={errors.review?.message}
      >
        <textarea
          id="review"
          rows={10}
          placeholder="책을 읽고 느낀 점을 자유롭게 남겨 주세요."
          aria-invalid={errors.review ? true : undefined}
          css={[fieldInputStyle, { resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }]}
          {...register('review', { validate: validateReview })}
        />
      </FormField>
      <p
        css={{
          fontSize: 13,
          color: required && length < REVIEW_MIN_LENGTH ? '#92400e' : '#6b7280',
          margin: 0,
          textAlign: 'right',
        }}
      >
        {required ? `${length} / 최소 ${REVIEW_MIN_LENGTH}자` : `${length}자`}
      </p>
    </div>
  );
}
