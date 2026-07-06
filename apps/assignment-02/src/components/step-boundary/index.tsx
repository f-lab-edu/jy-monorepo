/** @jsxImportSource @emotion/react */
'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

// 스텝 화면 공통 에러·로딩 경계 (assignment-01 ListBoundary 패턴).
// QueryErrorResetBoundary와 연동해 "다시 시도" 시 실패한 쿼리를 리셋한다.

function StepErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // error는 unknown이라 Error 여부를 좁혀 안전하게 메시지를 꺼낸다.
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

  return (
    <div role="alert" css={{ padding: '48px 0', textAlign: 'center' }}>
      <p css={{ margin: '0 0 16px', color: '#dc2626' }}>{message}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        css={{
          padding: '10px 24px',
          borderRadius: 8,
          border: '1px solid #d1d5db',
          backgroundColor: '#fff',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

export function StepBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={StepErrorFallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
