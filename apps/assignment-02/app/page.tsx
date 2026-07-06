/** @jsxImportSource @emotion/react */
'use client';

import Link from 'next/link';

// 인트로: 서비스 소개 + 구독 시작.
// "이어서 진행" 버튼(진행 중 상태 복귀)은 store가 생기는 PR #3에서 추가한다.
export default function IntroPage() {
  return (
    <main
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
        minHeight: '100dvh',
        paddingBottom: 80,
      }}
    >
      <h1 css={{ fontSize: 28, margin: 0 }}>구독 서비스</h1>
      <p css={{ fontSize: 16, lineHeight: 1.6, color: '#555', margin: 0 }}>
        플랜 선택부터 결제까지, 4단계로 간단하게 구독을 시작하세요.
      </p>
      <Link
        href="/plans"
        css={{
          display: 'block',
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
        구독 시작하기
      </Link>
    </main>
  );
}
