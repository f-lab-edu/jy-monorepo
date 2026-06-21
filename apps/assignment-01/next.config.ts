import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@jy/next-runtime'],
  compiler: {
    // css prop을 swc가 변환한다. 전역 jsxImportSource(@emotion/react)는 RSC와 충돌하므로
    // 쓰지 않고, css prop이 필요한 클라이언트 컴포넌트만 swc 컴파일러로 처리한다.
    emotion: true,
  },
  images: {
    // Rick and Morty API의 캐릭터 이미지를 next/image로 최적화하기 위해 도메인을 허용한다.
    remotePatterns: [{ protocol: 'https', hostname: 'rickandmortyapi.com' }],
  },
};

export default nextConfig;
