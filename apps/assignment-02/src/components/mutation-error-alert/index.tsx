/** @jsxImportSource @emotion/react */
'use client';

// mutation 에러 표시라는 횡단관심사를 모은 선언적 컴포넌트.
//
// 이 컴포넌트는 아무것도 "감지"하지 않는다 — 감지는 상위의 useMutation이 한다
// (mutation 상태가 바뀌면 훅이 호출부 컴포넌트를 리렌더시킨다). 여기는 매 렌더에
// 전달받은 error 값을 그대로 그릴 뿐이다: UI = f(state).
//   error === null  → 아무것도 그리지 않음 (평상시)
//   error가 Error   → 그 메시지를 표시
//   그 외 값        → 호출부가 정한 fallback 문구를 표시
// 재시도로 mutation이 다시 시작되면 TanStack Query가 error를 null로 되돌리고,
// 리렌더에서 이 컴포넌트가 자연히 사라진다 — show/hide를 직접 관리할 일이 없다.

type MutationErrorAlertProps = {
  /** mutation.error를 그대로 전달한다. null이면 아무것도 그리지 않는다. */
  error: unknown;
  /** Error 인스턴스가 아닐 때 보여줄 도메인별 기본 문구 */
  fallback: string;
  /** 메시지 앞에 붙일 도메인 맥락 (예: "선택하신 정보가 만료되었습니다") */
  title?: string | undefined;
  /** inline: 폼 아래 한 줄 / banner: 배경 있는 강조 박스 */
  variant?: 'inline' | 'banner';
};

export function MutationErrorAlert({
  error,
  fallback,
  title,
  variant = 'inline',
}: MutationErrorAlertProps) {
  // 에러가 없는 상태의 UI는 "없음"이다. 평상시 렌더는 이 줄에서 끝난다.
  if (error === null || error === undefined) return null;

  const message = error instanceof Error ? error.message : fallback;

  return (
    // role="alert": 이 요소가 DOM에 새로 나타나는 순간 스크린리더가 즉시 읽어준다.
    // CSS로 숨겼다 보이는 방식이 아니라 조건부 렌더(null → 요소)여야 동작한다.
    <p role="alert" css={styles[variant]}>
      {title ? `${title} — ${message}` : message}
    </p>
  );
}

const base = { margin: 0, color: '#dc2626', fontSize: 14 } as const;

const styles = {
  inline: base,
  banner: {
    ...base,
    padding: '12px 14px',
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    lineHeight: 1.6,
  },
} as const;
