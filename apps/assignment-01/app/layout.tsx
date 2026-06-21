import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { QueryProvider } from './providers';
import { EmotionRegistry } from './registry';

export const metadata: Metadata = {
  title: 'assignment-01 — 목록 페이지',
  description: 'Suspense / ErrorBoundary 기반 페이지네이션·무한스크롤 목록 과제',
};

// 앱 전역 Provider는 여기서 한 번만 감싼다(Emotion 스타일 주입 → Query 캐시 순).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>
          <QueryProvider>{children}</QueryProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
