import { useEffect, useState } from 'react';

// 값이 delay(ms) 동안 더 이상 바뀌지 않을 때만 갱신되는 debounce 훅.
// 빠른 연속 입력마다 반응하지 않고, 입력이 멎은 뒤의 "최종값"만 반영할 때 쓴다.
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // value가 바뀔 때마다 타이머를 새로 건다. delay 안에 또 바뀌면
    // 정리 함수(clearTimeout)가 이전 타이머를 취소하므로, 입력이 멈춘 뒤에만 값이 확정된다.
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
