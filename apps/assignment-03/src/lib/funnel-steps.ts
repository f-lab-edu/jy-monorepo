import type { FieldPath } from 'react-hook-form';

import type { ReadingRecordFormValues } from '@/lib/reading-record';

// 스텝 정의. 배열 순서가 곧 스텝 번호(인덱스 + 1)다.
export const FUNNEL_STEPS = [
  { title: '도서 정보', description: '도서 기본 정보와 독서 상태, 독서 기간을 입력합니다.' },
  { title: '평가', description: '추천 여부와 별점을 매깁니다.' },
  { title: '독후감', description: '책에 대한 감상을 남깁니다.' },
  { title: '인용구', description: '기억하고 싶은 문장을 기록합니다.' },
  { title: '공개 설정', description: '이 기록의 공개 여부를 정합니다.' },
] as const;

export const TOTAL_STEPS = FUNNEL_STEPS.length;

// "다음" 클릭 시 검증(trigger)할 스텝별 필드 목록. 각 스텝 구현 PR에서 채운다.
export const STEP_FIELDS: Record<number, FieldPath<ReadingRecordFormValues>[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

// ?step= 쿼리 파라미터 원형을 유효한 스텝 번호로 정규화한다(비숫자·범위 밖 → 1).
export function parseStep(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > TOTAL_STEPS) return 1;
  return parsed;
}

export function getStepMeta(step: number) {
  return FUNNEL_STEPS[step - 1] ?? FUNNEL_STEPS[0];
}
