import { nextConfig } from '@jy/eslint-config/next';

export default [
  ...nextConfig,
  {
    rules: {
      // 이 앱은 Emotion css prop을 쓰므로 css를 알 수 없는 속성 에러에서 제외한다.
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },
];
