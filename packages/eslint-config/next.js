import pluginNext from '@next/eslint-plugin-next';

import { reactLibraryConfig } from './react-library.js';

/**
 * Next.js 앱용 ESLint 설정 (flat config).
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  ...reactLibraryConfig,
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    // Next가 자동 생성하는 파일이라 직접 수정하지 않으므로 린트에서 제외한다.
    ignores: ['next-env.d.ts'],
  },
];

export default nextConfig;
