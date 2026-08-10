/** @jsxImportSource @emotion/react */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { consumeCompleteToken } from '@/lib/complete-token';
import { useSubscriptionStore } from '@/store/subscription-store';

// Step5 — 완료 화면. StepGuard 대신 완료 토큰으로 진입을 판정한다(완료 토큰 규약).
// 토큰은 확인 즉시 소비되므로 이 화면을 새로고침하면 /로 돌아간다 — 의도된 동작.
export default function CompletePage() {
  const router = useRouter();
  const reset = useSubscriptionStore((state) => state.reset);
  const [granted, setGranted] = useState(false);
  // StrictMode의 이펙트 2회 실행이 "1회차에 토큰 소비 → 2회차엔 토큰 없음 → 오판 redirect"로
  // 이어지지 않도록 판정을 1회로 고정한다.
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (consumeCompleteToken()) {
      // 퍼널 선택값을 비워 다음 구독을 처음부터 시작하게 한다. 완료 신호는 토큰이 들고
      // 있었으므로 reset이 화면 판정에 영향을 주지 않는다(store에 신호를 안 두는 이유).
      reset();
      setGranted(true);
    } else {
      router.replace('/');
    }
  }, [reset, router]);

  // 판정 전(토큰 확인 중)과 redirect 대기 중에는 화면을 그리지 않는다.
  if (!granted) return null;

  return (
    <main
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        minHeight: '100dvh',
        paddingBottom: 80,
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          fontSize: 32,
        }}
      >
        ✓
      </div>
      <h1 css={{ margin: 0, fontSize: 24 }}>구독이 완료되었습니다</h1>
      <p css={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#555' }}>
        지금부터 모든 콘텐츠를 자유롭게 이용할 수 있어요.
      </p>
      <Link
        href="/"
        css={{
          display: 'block',
          width: '100%',
          padding: '14px 0',
          borderRadius: 8,
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          textAlign: 'center',
          textDecoration: 'none',
        }}
      >
        홈으로
      </Link>
    </main>
  );
}
