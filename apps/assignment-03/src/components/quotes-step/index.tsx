/** @jsxImportSource @emotion/react */
'use client';

import { css } from '@emotion/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { fieldInputStyle } from '@/components/form-field/form-field.styles';
import type { ReadingRecordFormValues } from '@/lib/reading-record';
import {
  QUOTE_PAGE_REQUIRED_THRESHOLD,
  requiresQuotePage,
  validateQuotePage,
  validateQuoteText,
} from '@/lib/reading-record-rules';

// 인용구 카드는 행마다 반복되므로 스타일을 모듈 상수로 끌어올려 렌더마다 재생성되지 않게 한다.
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

const addButtonStyle = css({
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px dashed #9ca3af',
  backgroundColor: '#fff',
  color: '#374151',
  fontSize: 15,
  cursor: 'pointer',
  '&:hover': { borderColor: '#2563eb', color: '#2563eb' },
});

// Step4 — 인용구 다중 등록·삭제(useFieldArray).
// 인용구는 0개도 허용하되, 2개 이상이면 모든 페이지 번호가 필수가 된다(과제 명세).
// 페이지 인풋은 type="number" 대신 text + 정규식 검증을 쓴다 — number 인풋은 잘못된 입력을
// 빈 문자열로 돌려줘서 "숫자만" 규칙이 검증되지 않고 조용히 사라지기 때문.
export function QuotesStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'quotes' });

  const pageRequired = requiresQuotePage(fields.length);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {fields.length === 0 ? (
        <p
          css={{
            padding: '20px 16px',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            fontSize: 14,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          아직 등록한 인용구가 없습니다. 남길 문장이 없다면 그대로 다음 단계로 넘어가도 됩니다.
        </p>
      ) : (
        fields.map((field, index) => {
          const quoteErrors = errors.quotes?.[index];

          return (
            <div key={field.id} css={quoteCardStyle}>
              <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong css={{ fontSize: 14, color: '#374151' }}>인용구 {index + 1}</strong>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`인용구 ${index + 1} 삭제`}
                  css={removeButtonStyle}
                >
                  삭제
                </button>
              </div>

              <FormField
                label="문장"
                htmlFor={`quote-text-${index}`}
                error={quoteErrors?.text?.message}
              >
                <textarea
                  id={`quote-text-${index}`}
                  rows={3}
                  placeholder="기억하고 싶은 문장을 그대로 옮겨 적어 주세요."
                  aria-invalid={quoteErrors?.text ? true : undefined}
                  css={[
                    fieldInputStyle,
                    { resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 },
                  ]}
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
        })
      )}

      <button type="button" onClick={() => append({ text: '', page: '' })} css={addButtonStyle}>
        + 인용구 추가
      </button>

      {pageRequired && (
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
          인용구가 {QUOTE_PAGE_REQUIRED_THRESHOLD}개 이상이라 모든 인용구의 페이지 번호가
          필수입니다.
        </p>
      )}
    </div>
  );
}
