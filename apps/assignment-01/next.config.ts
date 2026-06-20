import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    // css prop을 swc가 변환한다. 전역 jsxImportSource(@emotion/react)는 RSC와 충돌하므로
    // 쓰지 않고, css prop이 필요한 클라이언트 컴포넌트만 swc 컴파일러로 처리한다.
    emotion: true,
  },
};

export default nextConfig;
