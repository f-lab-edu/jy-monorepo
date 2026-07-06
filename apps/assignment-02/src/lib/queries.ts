import { queryOptions } from '@tanstack/react-query';

import { fetchJson } from '@/lib/api-client';
import type { Plan, User } from '@/lib/types';

// 쿼리 정의(키 + fetcher)를 한곳에 모은다.
// 같은 키를 Step1과 Checkout 요약(PR #8)이 공유하므로 흩어지면 키 오타로 캐시가 갈라진다.

export const plansQueryOptions = queryOptions({
  queryKey: ['plans'],
  queryFn: () => fetchJson<Plan[]>('/api/subscriptions'),
});

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: () => fetchJson<User>('/api/user'),
});
