import { css } from '@emotion/react';

// 전 스텝에서 공유하는 인풋 공통 스타일.
// 유효성 실패 시 붉은 아웃라인은 aria-invalid 속성으로 표현한다(심화 요구사항).
export const fieldInputStyle = css({
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 15,
  backgroundColor: '#fff',
  '&:focus-visible': {
    outline: '2px solid #2563eb',
    outlineOffset: 1,
    borderColor: '#2563eb',
  },
  "&[aria-invalid='true']": {
    borderColor: '#dc2626',
    '&:focus-visible': { outline: '2px solid #dc2626' },
  },
  '&:disabled': {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
});
