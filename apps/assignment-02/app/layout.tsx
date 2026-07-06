import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { EmotionRegistry } from '@jy/next-runtime/emotion-registry';
import { QueryProvider } from '@jy/next-runtime/query-provider';

import { MobileShell } from '@/components/mobile-shell';

export const metadata: Metadata = {
  title: 'assignment-02 — 구독 서비스',
  description: '5단계 구독 퍼널(플랜 → 프로필 → 결제 → 확인 → 완료) 과제',
};

// 앱 전역 Provider는 여기서 한 번만 감싼다(Emotion 스타일 주입 → Query 캐시 순).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>
          <QueryProvider>
            <MobileShell>{children}</MobileShell>
          </QueryProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
