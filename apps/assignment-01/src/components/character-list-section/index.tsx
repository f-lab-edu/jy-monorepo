'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CharacterList } from '@/components/character-list';
import { ErrorFallback } from '@/components/error-fallback';

// 목록을 감싸는 에러·로딩 경계. 이 컴포넌트가 클라이언트 경계가 되어
// 하위(CharacterList·CharacterCard·Pagination)는 import 그래프상 자동으로 클라이언트가 된다.
// QueryErrorResetBoundary와 연동해 "다시 시도" 시 실패한 쿼리를 리셋한다.
export function CharacterListSection({ page }: { page: number }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<p>불러오는 중…</p>}>
            <CharacterList page={page} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
