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

/**
 * 별점 × 독후감 규칙 (과제 명세): 별점이 1점 또는 5점이면 독후감 100자 이상 필수.
 * 명세가 "1점 또는 5점"을 명시하므로 0.5·1.5·4.5점 등 근접 값은 해당하지 않는 것으로 해석한다.
 */
export const REVIEW_MIN_LENGTH = 100;

export function requiresReview(rating: number): boolean {
  return rating === 1 || rating === 5;
}

export function validateRating(value: number): true | string {
  if (Number.isNaN(value)) return '별점을 입력해 주세요.';
  if (value < 0 || value > 5) return '별점은 0점과 5점 사이여야 합니다.';
  if (!Number.isInteger(value * 2)) return '별점은 0.5점 단위로 입력해 주세요.';
  return true;
}

export function validateReview(value: string, form: ReadingRecordFormValues): true | string {
  if (!requiresReview(form.rating)) return true;
  const length = value.trim().length;
  if (length < REVIEW_MIN_LENGTH) {
    return `별점이 ${form.rating}점인 경우 의견을 뒷받침할 독후감을 ${REVIEW_MIN_LENGTH}자 이상 작성해 주세요. (현재 ${length}자)`;
  }
  return true;
}

/**
 * 인용구 규칙 (과제 명세): 인용구가 2개 이상이면 모든 페이지 번호가 필수,
 * 1개 이하면 선택. 페이지 번호는 숫자만 받고 도서 전체 페이지 수보다 작아야 한다.
 *
 * 인용구 자체는 0개도 허용한다 — 명세의 "1개 이하면 optional"이 0개 상태를 전제한다.
 */
export const QUOTE_PAGE_REQUIRED_THRESHOLD = 2;

export function requiresQuotePage(quoteCount: number): boolean {
  return quoteCount >= QUOTE_PAGE_REQUIRED_THRESHOLD;
}

// 행을 추가해 놓고 비워두면 의미 없는 인용구가 제출되므로, 있는 행의 본문은 필수로 본다.
export function validateQuoteText(value: string): true | string {
  return value.trim() !== '' || '인용구 내용을 입력해 주세요. 남기지 않을 항목은 삭제해 주세요.';
}

/**
 * 페이지 번호는 인풋 원형(문자열)으로 들어온다.
 * 조건부 required라 빈 값 통과 여부가 인용구 개수에 따라 달라지므로 setValueAs로 숫자화하지 않고
 * 문자열 그대로 검증한다 — 빈 문자열과 0을 구분해야 하기 때문.
 */
export function validateQuotePage(value: string, form: ReadingRecordFormValues): true | string {
  const trimmed = value.trim();
  if (trimmed === '') {
    return (
      !requiresQuotePage(form.quotes.length) ||
      `인용구가 ${QUOTE_PAGE_REQUIRED_THRESHOLD}개 이상이면 페이지 번호를 모두 입력해 주세요.`
    );
  }
  if (!/^\d+$/.test(trimmed)) return '페이지 번호는 숫자만 입력해 주세요.';
  const page = Number(trimmed);
  if (page < 1) return '페이지 번호는 1 이상이어야 합니다.';
  // totalPages는 Step1의 필수값이지만, 미입력 상태로 넘어온 경우 상한 검증은 보류한다
  // (전체 페이지 수 자체의 에러가 Step1에서 먼저 잡힌다).
  if (form.totalPages !== null && page >= form.totalPages) {
    return `페이지 번호는 전체 페이지 수(${form.totalPages}쪽)보다 작아야 합니다.`;
  }
  return true;
}
