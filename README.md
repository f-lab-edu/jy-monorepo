# jy-monorepo

F-lab 과제를 프로젝트 단위로 관리하는 모노레포.
React / TypeScript / Next.js / Emotion 기반.

## 스택

- **패키지 매니저:** pnpm (workspaces)
- **모노레포 도구:** Turborepo
- **프레임워크:** Next.js
- **언어:** TypeScript
- **스타일링:** Emotion

## 구조

```
jy-monorepo/
├── apps/                 # 과제별 애플리케이션 (각 과제 = 1 프로젝트)
├── packages/
│   ├── tsconfig/         # 공통 TypeScript 설정 (@jy/tsconfig)
│   └── eslint-config/    # 공통 ESLint flat config (@jy/eslint-config)
├── turbo.json            # Turborepo 태스크 파이프라인
├── pnpm-workspace.yaml   # 워크스페이스 정의
└── package.json          # 루트
```

## 명령어 (루트 기준)

| 명령어 | 설명 |
| --- | --- |
| `pnpm install` | 전체 의존성 설치 |
| `pnpm dev` | 모든 앱 개발 서버 실행 |
| `pnpm build` | 전체 빌드 |
| `pnpm lint` | 전체 린트 |
| `pnpm typecheck` | 전체 타입 체크 |
| `pnpm format` | Prettier 포맷팅 |

## 새 과제 추가하기

1. `apps/<assignment-name>/` 에 Next.js 앱 생성
2. 앱의 `tsconfig.json` 에서 `@jy/tsconfig/nextjs.json` extends
3. 앱의 `eslint.config.mjs` 에서 `@jy/eslint-config/next` import
4. 공통 의존성은 `"@jy/tsconfig": "workspace:*"` 형식으로 참조

## 공통 설정 사용 예시

**tsconfig.json**
```json
{
  "extends": "@jy/tsconfig/nextjs.json",
  "compilerOptions": { "baseUrl": "." },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

**eslint.config.mjs**
```js
import { nextConfig } from '@jy/eslint-config/next';

export default nextConfig;
```
