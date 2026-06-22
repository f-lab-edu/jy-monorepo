import { useEffect, useRef } from 'react';

// 관찰 대상(반환된 ref)이 화면(뷰포트)에 들어오면 onIntersect를 호출하는 훅.
// enabled가 false면 관찰하지 않는다(예: 더 불러올 페이지가 없을 때 비활성화).
export function useIntersectionObserver(onIntersect: () => void, enabled: boolean) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver((entries) => {
      // 대상이 뷰포트에 들어온 순간에만 콜백을 실행한다.
      if (entries[0]?.isIntersecting) {
        onIntersect();
      }
    });
    observer.observe(target);

    // 언마운트·의존성 변경 시 관찰을 정리한다.
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return targetRef;
}
