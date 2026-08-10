import { css } from '@emotion/react';

// 칩 형태의 라디오 라벨. 선택된 칩은 :has 셀렉터로 강조한다.
export const radioChipStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 14px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 14,
  cursor: 'pointer',
  '&:has(input:checked)': {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    fontWeight: 600,
  },
});

export const radioInputStyle = css({
  accentColor: '#2563eb',
  margin: 0,
});
