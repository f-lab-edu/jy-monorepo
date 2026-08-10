// 독서 상태. 상태에 따라 독서 기간 입력 가능 여부가 달라진다(검증 규칙은 Step1 PR에서).
export const READING_STATUSES = ['wishlist', 'reading', 'finished', 'on-hold'] as const;
export type ReadingStatus = (typeof READING_STATUSES)[number];

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  wishlist: '읽고 싶은 책',
  reading: '읽는 중',
  finished: '읽음',
  'on-hold': '보류 중',
};

// 인용구 한 건. 페이지 번호는 인용구 개수에 따라 required가 달라지는 조건부 필드라
// 인풋 원형(문자열)으로 두고 검증·제출 시 숫자로 다룬다.
export interface QuoteField {
  text: string;
  page: string;
}

// 5스텝 전체를 관통하는 단일 폼 값. 날짜는 <input type="date"> 원형인 'yyyy-MM-dd' 문자열.
export interface ReadingRecordFormValues {
  // Step1 — 도서 기본 정보 · 독서 상태 · 독서 기간
  title: string;
  author: string;
  publishedAt: string;
  totalPages: number | null;
  status: ReadingStatus | null;
  startedAt: string;
  finishedAt: string;
  // Step2 — 추천 여부 · 별점(0~5, 0.5 스케일)
  recommend: boolean | null;
  rating: number;
  // Step3 — 독후감
  review: string;
  // Step4 — 인용구 목록
  quotes: QuoteField[];
  // Step5 — 공개 여부
  isPublic: boolean;
}

// 선택형 필드(status·recommend)는 null로 시작해 "미선택"과 "선택함"을 구분한다.
export const DEFAULT_FORM_VALUES: ReadingRecordFormValues = {
  title: '',
  author: '',
  publishedAt: '',
  totalPages: null,
  status: null,
  startedAt: '',
  finishedAt: '',
  recommend: null,
  rating: 0,
  review: '',
  quotes: [],
  isPublic: false,
};
