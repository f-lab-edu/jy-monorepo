'use client';

import { useEffect, useState } from 'react';

import { useSubscriptionStore } from '@/store/subscription-store';

// persist가 sessionStorage 복원을 마쳤는지 여부.
// SSR 첫 렌더는 항상 false(서버는 브라우저 storage를 모른다) → 클라이언트에서 복원 완료 후 true.
// 스텝 가드·"이어서 진행"은 true가 되기 전까지 판단을 유보해야
// 초기값(null)을 보고 잘못 redirect하는 오탐을 막을 수 있다.
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 마운트 시점에 이미 복원이 끝났을 수 있고(동기 복원), 아직이면 완료 이벤트를 구독한다.
    if (useSubscriptionStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useSubscriptionStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
