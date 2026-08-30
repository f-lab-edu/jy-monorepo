/** @jsxImportSource @emotion/react */
'use client';

import { css } from '@emotion/react';
import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { fieldInputStyle } from '@/components/form-field/form-field.styles';
import type { ReadingRecordFormValues } from '@/lib/reading-record';
import { validateQuotePage, validateQuoteText } from '@/lib/reading-record-rules';

const quoteCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  backgroundColor: '#fafafa',
});

const removeButtonStyle = css({
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  color: '#dc2626',
  fontSize: 13,
  cursor: 'pointer',
  '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
});

interface QuoteItemProps {
  /** useFieldArray 기준 행 위치. register 경로와 라벨 번호에 쓴다. */
  index: number;
  /** 페이지 번호 필수 여부 — 인용구 총 개수에 달린 정책이라 목록 소유자(QuotesStep)가 내려준다. */
  pageRequired: boolean;
  onRemove: (index: number) => void;
}

// 인용구 한 건의 카드. QuotesStep의 사적 자식으로, 폼 값은 다른 스텝들과 동일하게
// useFormContext로 직접 구독한다(FormProvider 내부에서만 렌더된다는 전제).
// 페이지 인풋은 type="number" 대신 text + 정규식 검증을 쓴다 — number 인풋은 잘못된 입력을
// 빈 문자열로 돌려줘서 "숫자만" 규칙이 검증되지 않고 조용히 사라지기 때문.
export function QuoteItem({ index, pageRequired, onRemove }: QuoteItemProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();

  const quoteErrors = errors.quotes?.[index];

  return (
    <div css={quoteCardStyle}>
      <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong css={{ fontSize: 14, color: '#374151' }}>인용구 {index + 1}</strong>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`인용구 ${index + 1} 삭제`}
          css={removeButtonStyle}
        >
          삭제
        </button>
      </div>

      <FormField label="문장" htmlFor={`quote-text-${index}`} error={quoteErrors?.text?.message}>
        <textarea
          id={`quote-text-${index}`}
          rows={3}
          placeholder="기억하고 싶은 문장을 그대로 옮겨 적어 주세요."
          aria-invalid={quoteErrors?.text ? true : undefined}
          css={[fieldInputStyle, { resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }]}
          {...register(`quotes.${index}.text`, { validate: validateQuoteText })}
        />
      </FormField>

      <FormField
        label={pageRequired ? '페이지 번호' : '페이지 번호 (선택)'}
        htmlFor={`quote-page-${index}`}
        error={quoteErrors?.page?.message}
      >
        <input
          id={`quote-page-${index}`}
          type="text"
          inputMode="numeric"
          placeholder="예: 128"
          aria-invalid={quoteErrors?.page ? true : undefined}
          css={fieldInputStyle}
          {...register(`quotes.${index}.page`, { validate: validateQuotePage })}
        />
      </FormField>
    </div>
  );
}
