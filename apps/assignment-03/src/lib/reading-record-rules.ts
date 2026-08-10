import type { ReadingRecordFormValues, ReadingStatus } from '@/lib/reading-record';

/**
 * 독서 상태 × 독서 기간 규칙 (과제 명세):
 * - 읽고 싶은 책: 기간 입력 금지
 * - 읽는 중 / 보류 중: 시작일만 입력(필수), 종료일 금지
 * - 읽음: 시작일·종료일 모두 필수
 *
 * RHF validate 콜백은 순수 함수로 분리해 컴포넌트와 독립적으로 테스트할 수 있게 한다.
 * 날짜는 'yyyy-MM-dd' 문자열이라 사전순 비교가 곧 날짜 비교다.
 */
export function allowsStartedAt(status: ReadingStatus | null): boolean {
  return status !== null && status !== 'wishlist';
}

export function allowsFinishedAt(status: ReadingStatus | null): boolean {
  return status === 'finished';
}

export function validateStartedAt(value: string, form: ReadingRecordFormValues): true | string {
  const { status, publishedAt, finishedAt } = form;
  // 상태 미선택이면 기간 검증은 보류한다 — 상태 required가 먼저 잡는다.
  if (status === null) return true;
  if (status === 'wishlist') {
    return value === '' || '읽고 싶은 책은 독서 기간을 입력할 수 없습니다.';
  }
  if (value === '') return '독서 시작일을 입력해 주세요.';
  if (publishedAt !== '' && value < publishedAt) {
    return '독서 시작일은 도서 출판일 이후여야 합니다.';
  }
  if (finishedAt !== '' && value > finishedAt) {
    return '독서 시작일은 독서 종료일보다 늦을 수 없습니다.';
  }
  return true;
}

export function validateFinishedAt(value: string, form: ReadingRecordFormValues): true | string {
  const { status } = form;
  if (status === 'finished') {
    return value !== '' || '독서 종료일을 입력해 주세요.';
  }
  return value === '' || '독서를 마친 상태가 아니면 종료일을 입력할 수 없습니다.';
}

export function validateTotalPages(value: number | null): true | string {
  if (value === null) return '전체 페이지 수를 입력해 주세요.';
  if (!Number.isInteger(value) || value < 1) {
    return '전체 페이지 수는 1 이상의 정수로 입력해 주세요.';
  }
  return true;
}
