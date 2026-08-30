/** @jsxImportSource @emotion/react */
'use client';

import { css } from '@emotion/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { QuoteItem } from '@/components/quotes-step/quote-item';
import type { ReadingRecordFormValues } from '@/lib/reading-record';
import { QUOTE_PAGE_REQUIRED_THRESHOLD, requiresQuotePage } from '@/lib/reading-record-rules';

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
// 이 컴포넌트는 목록 관리(추가·삭제·개수 정책)만 맡고, 행 렌더링은 QuoteItem이 맡는다.
export function QuotesStep() {
  const { control } = useFormContext<ReadingRecordFormValues>();
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
        fields.map((field, index) => (
          <QuoteItem key={field.id} index={index} pageRequired={pageRequired} onRemove={remove} />
        ))
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
