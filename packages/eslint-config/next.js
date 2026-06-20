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
];

export default nextConfig;
