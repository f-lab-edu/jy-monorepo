// 완료 토큰 규약(CLAUDE.md): 구독 완료 신호는 store 밖 sessionStorage 별도 키에 둔다.
// store에 넣으면 /complete 진입 직후의 reset()이 신호까지 지워 "완료 직후 진입"과
// "무단 직접 진입"을 구분할 수 없게 된다.

const COMPLETE_TOKEN_KEY = 'subscription-complete';

/** checkout 성공(onSuccess) 시점에 발급한다. */
export function issueCompleteToken(): void {
  sessionStorage.setItem(COMPLETE_TOKEN_KEY, '1');
}

/**
 * 토큰이 있으면 소비(삭제)하고 true를 반환한다. /complete 마운트에서 한 번만 호출한다.
 * 소비되므로 /complete 새로고침 시에는 false → /로 돌려보내는 것이 의도된 동작이다.
 */
export function consumeCompleteToken(): boolean {
  const exists = sessionStorage.getItem(COMPLETE_TOKEN_KEY) !== null;
  sessionStorage.removeItem(COMPLETE_TOKEN_KEY);
  return exists;
}
