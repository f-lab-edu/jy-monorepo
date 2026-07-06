/** @jsxImportSource @emotion/react */
'use client';

import { Global } from '@emotion/react';
import type { ReactNode } from 'react';

// 모바일 과제이므로 모든 화면을 최대폭 480px의 중앙 프레임 안에서 렌더한다.
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Global
        styles={{
          body: { margin: 0, backgroundColor: '#f5f6f8' },
          '*': { boxSizing: 'border-box' },
        }}
      />
      <div
        css={{
          maxWidth: 480,
          minHeight: '100dvh',
          margin: '0 auto',
          padding: '0 20px',
          backgroundColor: '#ffffff',
        }}
      >
        {children}
      </div>
    </>
  );
}
