// 카드번호 유효성·마스킹 순수 함수.
// 서버(등록 처리)와 클라이언트(폼 검증)가 동일 규칙을 공유한다.

export const CARD_NUMBER_LENGTH = 16;

/** 입력에서 공백·하이픈을 제거해 숫자만 남긴다. */
export function normalizeCardNumber(value: string): string {
  return value.replace(/[\s-]/g, '');
}

/** 정규화 후 숫자 16자리인지 검사한다. */
export function isValidCardNumber(value: string): boolean {
  return new RegExp(`^\\d{${CARD_NUMBER_LENGTH}}$`).test(normalizeCardNumber(value));
}

/**
 * 마지막 4자리를 `*`로 가린다. 예: '1234 5678 9012 ****'
 * 과제 명세 문구("마지막 4자리는 * masking")를 따른다 — 통상 관례(앞 12자리 마스킹)와
 * 반대라서 멘토 확인 대상이며, 방향 전환 시 이 함수만 수정하면 된다.
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = normalizeCardNumber(cardNumber);
  const masked = digits.slice(0, 12) + '****';
  return masked.replace(/(.{4})(?=.)/g, '$1 ');
}
