import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { EmotionRegistry } from '@jy/next-runtime/emotion-registry';
import { QueryProvider } from '@jy/next-runtime/query-provider';

import { GlobalStyles } from '@/components/global-styles';

export const metadata: Metadata = {
  title: '독서 기록 남기기',
  description: '5단계 멀티 스텝 폼으로 독서 기록을 작성하는 과제',
};

// 앱 전역 Provider는 여기서 한 번만 감싼다(Emotion 스타일 주입 → Query 캐시 순).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>
          <QueryProvider>
            <GlobalStyles />
            {children}
          </QueryProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
