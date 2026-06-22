'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';

// 목록을 감싸는 공통 에러·로딩 경계. 페이지네이션·무한스크롤이 함께 사용한다.
// QueryErrorResetBoundary와 연동해 "다시 시도" 시 실패한 쿼리를 리셋한다.
// fallback(로딩 UI)과 children(실제 목록)은 사용하는 쪽이 주입한다.
export function ListBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
