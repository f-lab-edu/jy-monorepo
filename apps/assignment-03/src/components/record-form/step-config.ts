import type { ComponentType } from 'react';
import type { FieldPath } from 'react-hook-form';

import { BookInfoStep } from '@/components/book-info-step';
import { QuotesStep } from '@/components/quotes-step';
import { RatingStep } from '@/components/rating-step';
import { ReviewStep } from '@/components/review-step';
import type { ReadingRecordFormValues } from '@/lib/reading-record';

/**
 * 스텝 구성 레지스트리 — 제목·설명·검증 대상 필드·콘텐츠 컴포넌트를 한곳에 모은다.
 *
 * - 스텝을 추가·수정할 때 이 배열만 고치면 되고, RecordForm은 개별 스텝을 몰라도 된다.
 * - React 컴포넌트를 참조하므로 lib(순수 도메인)이 아닌 components 레이어에 둔다.
 * - fields 순서 = 화면 순서 — 검증 실패 시 "순서상 첫 실패 필드" focus의 기준.
 */
interface FunnelStepConfig {
  readonly title: string;
  readonly description: string;
  readonly fields: readonly FieldPath<ReadingRecordFormValues>[];
  /** 스텝 콘텐츠 컴포넌트. null이면 아직 구현 전(플레이스홀더 노출). */
  readonly Content: ComponentType | null;
}

export const FUNNEL_STEPS = [
  {
    title: '도서 정보',
    description: '도서 기본 정보와 독서 상태, 독서 기간을 입력합니다.',
    fields: ['title', 'author', 'publishedAt', 'totalPages', 'status', 'startedAt', 'finishedAt'],
    Content: BookInfoStep,
  },
  {
    title: '평가',
    description: '추천 여부와 별점을 매깁니다.',
    fields: ['recommend', 'rating'],
    Content: RatingStep,
  },
  {
    title: '독후감',
    description: '책에 대한 감상을 남깁니다.',
    fields: ['review'],
    Content: ReviewStep,
  },
  {
    title: '인용구',
    description: '기억하고 싶은 문장을 기록합니다. 남길 문장이 없다면 건너뛸 수 있습니다.',
    fields: ['quotes'],
    Content: QuotesStep,
  },
  {
    title: '공개 설정',
    description: '이 기록의 공개 여부를 정합니다.',
    fields: [],
    Content: null,
  },
] as const satisfies readonly FunnelStepConfig[];

export const TOTAL_STEPS = FUNNEL_STEPS.length;

// step은 1부터 시작한다. 범위 밖이면 첫 스텝 구성으로 폴백.
export function getStepConfig(step: number): FunnelStepConfig {
  return FUNNEL_STEPS[step - 1] ?? FUNNEL_STEPS[0];
}
