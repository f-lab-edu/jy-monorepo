/** @jsxImportSource @emotion/react */
'use client';

import Link from 'next/link';

// 인트로: 서비스 소개 + 작성 시작 동선.
export default function IntroPage() {
  return (
    <main css={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <h1 css={{ fontSize: 28 }}>독서 기록 남기기</h1>
      <p css={{ color: '#555', lineHeight: 1.6 }}>
        5단계 멀티 스텝 폼으로 독서 기록을 작성합니다.
      </p>
      <Link
        href="/write?step=1"
        css={{
          display: 'block',
          marginTop: 24,
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
        작성 시작하기
      </Link>
    </main>
  );
}
