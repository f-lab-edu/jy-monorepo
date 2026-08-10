/** @jsxImportSource @emotion/react */
'use client';

// 인트로: 스캐폴딩 확인용 플레이스홀더. 설계 확정 후 스텝 진입 동선으로 교체한다.
export default function IntroPage() {
  return (
    <main css={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <h1 css={{ fontSize: 28 }}>독서 기록 남기기</h1>
      <p css={{ color: '#555', lineHeight: 1.6 }}>
        5단계 멀티 스텝 폼으로 독서 기록을 작성합니다.
      </p>
    </main>
  );
}
