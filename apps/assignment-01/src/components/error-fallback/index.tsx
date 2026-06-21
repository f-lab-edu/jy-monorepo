import type { FallbackProps } from 'react-error-boundary';

import { Container, Message, RetryButton } from './error-fallback.styles';

// ErrorBoundary가 에러를 잡았을 때 보여줄 공통 폴백 UI.
// resetErrorBoundary를 호출하면 경계가 리셋되어 다시 시도된다(PR #3에서도 재사용).
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // error는 unknown 타입이라 Error 여부를 좁혀 안전하게 메시지를 꺼낸다.
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

  return (
    <Container role="alert">
      <Message>{message}</Message>
      <RetryButton onClick={resetErrorBoundary}>다시 시도</RetryButton>
    </Container>
  );
}
