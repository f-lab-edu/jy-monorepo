import { nextConfig } from '@jy/eslint-config/next';

export default [
  ...nextConfig,
  {
    rules: {
      // 이 앱은 Emotion css prop을 쓰므로 css를 알 수 없는 속성 에러에서 제외한다.
      // (다른 앱은 styled 기본이라 공통 config가 아닌 이 앱 로컬에만 허용한다.)
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },
];
