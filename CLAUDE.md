# jy-monorepo

F-lab 과제를 **프로젝트(앱) 단위**로 관리하는 모노레포.
각 과제는 `apps/` 아래 독립 Next.js 앱으로 추가하고, 공통 코드는 `packages/`로 공유한다.

## 스택

- 패키지 매니저: **pnpm** (workspaces)
- 모노레포 도구: **Turborepo**
- 프레임워크: **Next.js** / **React** / **TypeScript**
- 스타일링: **Emotion**
- 테스트: **Vitest + React Testing Library**

## 디렉토리 구조

```
jy-monorepo/
├── apps/                 # 과제별 앱 (과제 1개 = 앱 1개)
├── packages/
│   ├── tsconfig/         # @jy/tsconfig — 공통 TS 설정
│   └── eslint-config/    # @jy/eslint-config — 공통 ESLint flat config
├── turbo.json            # Turborepo 태스크 파이프라인
├── pnpm-workspace.yaml
└── package.json          # 워크스페이스 루트
```

## 명령어 (루트 기준)

| 명령어 | 설명 |
| --- | --- |
| `pnpm install` | 전체 의존성 설치 |
| `pnpm dev` | 모든 앱 개발 서버 |
| `pnpm build` | 전체 빌드 (turbo 캐시 적용) |
| `pnpm lint` | 전체 린트 |
| `pnpm typecheck` | 전체 타입 체크 |
| `pnpm format` | Prettier 포맷팅 |

특정 앱만: `pnpm --filter <앱이름> <명령>` (예: `pnpm --filter assignment-01 dev`)

## 패키지 규칙

- 공통 패키지 네임스페이스는 **`@jy/*`**.
- 워크스페이스 내부 패키지는 **`"@jy/tsconfig": "workspace:*"`** 형식으로 참조한다 (npm 레지스트리에서 받지 않음).
- 모든 패키지/앱 폴더는 자기 `package.json`을 가져야 한다 (이름·의존성·진입점 정의).

## 새 과제(앱) 추가 절차

1. `apps/<assignment-name>/` 에 Next.js 앱 생성
2. `tsconfig.json` → `"extends": "@jy/tsconfig/nextjs.json"`
3. `eslint.config.mjs` → `import { nextConfig } from '@jy/eslint-config/next'`
4. 공통 패키지는 `workspace:*` 로 의존성 추가
5. **앱 고유의 맥락(과제 요구사항·Router 선택·특이 결정)은 해당 앱 폴더에 `CLAUDE.md`로 작성** (루트 내용과 중복 금지)

> 앱 추가 시 결정 필요: **App Router vs Pages Router** (App Router는 Emotion SSR registry 설정 필요), **Emotion 스타일 비중**.

## 코딩 컨벤션

- **언어**: 코드 주석·문서는 **한국어**로 작성한다. 식별자(변수·함수·타입)는 영어.
- **네이밍**:
  - 컴포넌트 폴더·파일: `kebab-case` (예: `character-card/index.tsx`). 컴포넌트 **함수명**만 `PascalCase` (예: `CharacterCard`).
  - 그 외 파일(훅·유틸·설정): `kebab-case` (예: `use-auth.ts`)
- **컴포넌트 구조**: **폴더당 컴포넌트**. (예: `character-card/index.tsx`, `character-card/character-card.styles.ts`, `character-card/character-card.test.tsx`)
- **import 경로**: **절대경로 alias `@/`** 사용. 깊은 상대경로(`../../..`) 지양.
- **Emotion**: **`styled` 컴포넌트를 기본**으로 하고, 일회성 미세조정에만 **`css` prop**을 혼용한다.
  - 재사용 컴포넌트의 스타일은 `*.styles.ts`로 분리.
- **TypeScript**: 최고 엄격도 유지 (`strict`, `noUncheckedIndexedAccess`, `noUnusedLocals` 등). 우회(`any`, `@ts-ignore`)는 지양하고 불가피하면 사유를 주석으로 남긴다.
- **테스트**: Vitest + RTL. 테스트 파일은 대상 컴포넌트와 같은 폴더에 `*.test.tsx`로 둔다.

## 커밋 규칙

- **Conventional Commits** 형식 + **한국어 본문**.
  - 예: `feat: 로그인 폼 유효성 검사 추가`
  - 타입: `feat` / `fix` / `chore` / `refactor` / `docs` / `test` / `style`
- **Claude는 절대로 직접 커밋·푸시·PR 생성을 하지 않는다.** `git commit`, `git push`, `gh pr create`를 실행하지 않으며, 사용자가 명시적으로 "커밋해", "PR 만들어"라고 지시하더라도 실행하지 않는다.
- 변경이 끝나면 **커밋 메시지와 PR 제목·본문 초안만 추천**한다. 실제 커밋·브랜치·푸시·PR 생성은 전적으로 사용자가 직접 수행한다.

## 작업 방식 (이 저장소에서 Claude의 역할)

- **설명·학습 중심.** 단순 구현보다 "왜 이렇게 하는가"를 함께 설명한다 (F-lab 학습 목적).
- 복잡하거나 방향성이 걸린 과제는 **먼저 분석·옵션·리스크를 브리핑하고 결정을 요청**한 뒤 진행한다. 독단적 결정 금지.
- 완료를 주장하기 전 검증(빌드·타입·테스트)으로 근거를 확보한다.
