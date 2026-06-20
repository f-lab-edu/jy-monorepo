'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * TanStack Query Provider.
 *
 * QueryClient를 useState 초기화 함수로 만들어, 리렌더마다 새로 생성되는 것을 막는다.
 * (모듈 스코프 싱글턴으로 두면 SSR 시 요청 간 캐시가 공유될 수 있어 위험하다.)
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 목록 데이터는 잠시 신선하다고 보고 불필요한 재요청을 줄인다.
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
