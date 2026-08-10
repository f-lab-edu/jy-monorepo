/** @jsxImportSource @emotion/react */
'use client';

import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { fieldInputStyle } from '@/components/form-field/form-field.styles';
import { RadioGroup } from '@/components/radio-group';
import {
  READING_STATUSES,
  READING_STATUS_LABELS,
  type ReadingRecordFormValues,
  type ReadingStatus,
} from '@/lib/reading-record';
import {
  allowsFinishedAt,
  allowsStartedAt,
  validateFinishedAt,
  validateStartedAt,
  validateTotalPages,
} from '@/lib/reading-record-rules';

// 독서 상태 라디오 옵션 (도메인 정의 순서 유지).
const STATUS_OPTIONS = READING_STATUSES.map((value) => ({
  value,
  label: READING_STATUS_LABELS[value],
}));

// Step1 — 도서 기본 정보 · 독서 상태 · 독서 기간.
// 상태에 따라 금지된 기간 인풋은 disabled로 막고(UX), 검증 규칙은 그대로 둔다
// (최종 제출 전 전체 재검증에서 스텝 간 소급 무효를 잡는 안전망).
export function BookInfoStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();

  const status = watch('status');
  const publishedAt = watch('publishedAt');
  const startedAt = watch('startedAt');

  // 상태 변경으로 금지된 기간 필드는 값을 비워 stale 값이 남지 않게 한다.
  const handleStatusChange = (next: ReadingStatus) => {
    if (!allowsStartedAt(next)) setValue('startedAt', '');
    if (!allowsFinishedAt(next)) setValue('finishedAt', '');
  };

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormField label="도서 제목" htmlFor="title" error={errors.title?.message}>
        <input
          id="title"
          type="text"
          placeholder="예: 클린 코드"
          aria-invalid={errors.title ? true : undefined}
          css={fieldInputStyle}
          {...register('title', { required: '도서 제목을 입력해 주세요.' })}
        />
      </FormField>

      <FormField label="저자 (선택)" htmlFor="author" error={errors.author?.message}>
        <input
          id="author"
          type="text"
          placeholder="예: 로버트 C. 마틴"
          aria-invalid={errors.author ? true : undefined}
          css={fieldInputStyle}
          {...register('author')}
        />
      </FormField>

      <div css={{ display: 'flex', gap: 12 }}>
        <FormField label="출판일" htmlFor="publishedAt" error={errors.publishedAt?.message}>
          <input
            id="publishedAt"
            type="date"
            aria-invalid={errors.publishedAt ? true : undefined}
            css={fieldInputStyle}
            {...register('publishedAt', { required: '출판일을 입력해 주세요.' })}
          />
        </FormField>

        <FormField label="전체 페이지 수" htmlFor="totalPages" error={errors.totalPages?.message}>
          <input
            id="totalPages"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="예: 584"
            aria-invalid={errors.totalPages ? true : undefined}
            css={fieldInputStyle}
            {...register('totalPages', {
              // 빈 문자열은 null로 정규화해 "미입력"과 "0"을 구분한다.
              setValueAs: (raw: string | number | null) =>
                raw === '' || raw === null ? null : Number(raw),
              validate: validateTotalPages,
            })}
          />
        </FormField>
      </div>

      <FormField label="독서 상태" error={errors.status?.message}>
        <RadioGroup
          options={STATUS_OPTIONS}
          {...register('status', {
            required: '독서 상태를 선택해 주세요.',
            onChange: (event) => handleStatusChange(event.target.value as ReadingStatus),
          })}
        />
      </FormField>

      <div css={{ display: 'flex', gap: 12 }}>
        <FormField label="독서 시작일" htmlFor="startedAt" error={errors.startedAt?.message}>
          <input
            id="startedAt"
            type="date"
            disabled={!allowsStartedAt(status)}
            min={publishedAt || undefined}
            aria-invalid={errors.startedAt ? true : undefined}
            css={fieldInputStyle}
            {...register('startedAt', { validate: validateStartedAt })}
          />
        </FormField>

        <FormField label="독서 종료일" htmlFor="finishedAt" error={errors.finishedAt?.message}>
          <input
            id="finishedAt"
            type="date"
            disabled={!allowsFinishedAt(status)}
            min={startedAt || publishedAt || undefined}
            aria-invalid={errors.finishedAt ? true : undefined}
            css={fieldInputStyle}
            {...register('finishedAt', { validate: validateFinishedAt })}
          />
        </FormField>
      </div>
    </div>
  );
}
