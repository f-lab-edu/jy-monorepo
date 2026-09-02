/** @jsxImportSource @emotion/react */
'use client';

import {
  READING_STATUS_LABELS,
  RECOMMEND_LABELS,
  VISIBILITY_LABELS,
  type ReadingRecordFormValues,
} from '@/lib/reading-record';

interface RecordCompleteProps {
  values: ReadingRecordFormValues;
}

// 제출 완료 화면 — 제출된 값의 요약을 보여준다. 저장 API는 로드맵 밖이라 화면 전환까지만.
// values는 최종 전체 재검증을 통과한 뒤에만 들어오지만, 타입상 nullable인 필드는 '-'로 방어한다.
export function RecordComplete({ values }: RecordCompleteProps) {
  const period = [values.startedAt, values.finishedAt].filter(Boolean).join(' ~ ');

  const rows: readonly [label: string, content: string][] = [
    ['도서', values.author ? `${values.title} — ${values.author}` : values.title],
    ['독서 상태', values.status ? READING_STATUS_LABELS[values.status] : '-'],
    ['독서 기간', period || '-'],
    ['추천', values.recommend ? RECOMMEND_LABELS[values.recommend] : '-'],
    ['별점', `★ ${values.rating.toFixed(1)}`],
    ['독후감', values.review.trim() ? `${values.review.trim().length}자 작성` : '작성 안 함'],
    ['인용구', values.quotes.length > 0 ? `${values.quotes.length}개 등록` : '등록 안 함'],
    ['공개 범위', values.visibility ? VISIBILITY_LABELS[values.visibility] : '-'],
  ];

  return (
    <section css={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <h2 css={{ fontSize: 22, margin: '0 0 4px' }}>독서 기록 작성 완료</h2>
      <p css={{ fontSize: 15, lineHeight: 1.6, color: '#555', margin: '0 0 24px' }}>
        작성한 내용을 확인해 주세요.
      </p>
      <dl
        css={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          gap: '12px 20px',
          padding: 20,
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          margin: 0,
        }}
      >
        {rows.map(([label, content]) => (
          <div key={label} css={{ display: 'contents' }}>
            <dt css={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>{label}</dt>
            <dd css={{ fontSize: 15, color: '#111827', margin: 0 }}>{content}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
