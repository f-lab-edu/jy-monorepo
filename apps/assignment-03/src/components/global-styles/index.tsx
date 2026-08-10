'use client';

import { Global } from '@emotion/react';

// 전역 리셋만 담당한다. 화면 골격(스텝 레이아웃·미리보기 배치)은 설계 확정 후 셸 컴포넌트로 분리한다.
export function GlobalStyles() {
  return (
    <Global
      styles={{
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif',
          color: '#1a1a1a',
          backgroundColor: '#fafafa',
        },
      }}
    />
  );
}
