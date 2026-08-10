/** @jsxImportSource @emotion/react */
'use client';

import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { RadioGroup } from '@/components/radio-group';
import {
  RECOMMEND_CHOICES,
  RECOMMEND_LABELS,
  type ReadingRecordFormValues,
} from '@/lib/reading-record';
import { requiresReview, validateRating } from '@/lib/reading-record-rules';

// 추천 여부 라디오 옵션 (도메인 정의 순서 유지).
const RECOMMEND_OPTIONS = RECOMMEND_CHOICES.map((value) => ({
  value,
  label: RECOMMEND_LABELS[value],
}));

// Step2 — 도서 추천 여부 · 별점(0~5, 0.5 스케일).
export function RatingStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();

  const rating = watch('rating');

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormField label="이 책을 추천하시나요?" error={errors.recommend?.message}>
        <RadioGroup
          options={RECOMMEND_OPTIONS}
          {...register('recommend', { required: '추천 여부를 선택해 주세요.' })}
        />
      </FormField>

      <FormField label="별점" htmlFor="rating" error={errors.rating?.message}>
        <div css={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            id="rating"
            type="range"
            min={0}
            max={5}
            step={0.5}
            aria-invalid={errors.rating ? true : undefined}
            css={{ flex: 1, accentColor: '#f59e0b', margin: 0 }}
            {...register('rating', { valueAsNumber: true, validate: validateRating })}
          />
          <strong css={{ fontSize: 18, minWidth: 64, textAlign: 'right', color: '#b45309' }}>
            ★ {Number.isNaN(rating) ? '-' : rating.toFixed(1)}
          </strong>
        </div>
      </FormField>

      {requiresReview(rating) && (
        <p
          css={{
            fontSize: 13,
            color: '#92400e',
            backgroundColor: '#fef3c7',
            padding: '10px 12px',
            borderRadius: 8,
            margin: 0,
          }}
        >
          별점 {rating}점은 다음 단계에서 의견을 뒷받침할 독후감을 100자 이상 작성해야
          합니다.
        </p>
      )}
    </div>
  );
}
