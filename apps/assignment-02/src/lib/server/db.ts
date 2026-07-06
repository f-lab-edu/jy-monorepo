import type { Coupon, PaymentMethod, Plan, Subscription, User } from '@/lib/types';

import { seedCoupons, seedPaymentMethods, seedPlans, seedUser } from './seed';

// Route Handler들이 공유하는 인메모리 mock 저장소.
// 서버 프로세스가 재시작되면 초기화된다(과제 목적상 허용 — 클라이언트는
// "영속 ID 무효화 방어" 규약으로 dangling 참조를 흡수한다. CLAUDE.md 참고).

type Db = {
  plans: Plan[];
  user: User;
  paymentMethods: PaymentMethod[];
  coupons: Coupon[];
  subscriptions: Subscription[];
  nextId: number;
};

// Next dev는 라우트마다 모듈을 재평가할 수 있어 모듈 스코프 변수로는 상태가 갈라진다.
// globalThis에 붙여 프로세스 안에서 단 하나의 저장소를 공유한다.
const globalStore = globalThis as typeof globalThis & { __assignment02Db?: Db };

export function getDb(): Db {
  globalStore.__assignment02Db ??= {
    plans: [...seedPlans],
    user: { ...seedUser },
    paymentMethods: [...seedPaymentMethods],
    coupons: [...seedCoupons],
    subscriptions: [],
    nextId: 2, // seed가 *_1을 쓰므로 2부터 발급
  };
  return globalStore.__assignment02Db;
}

/** 저장소 내에서 유일한 id를 발급한다. 예: issueId('pm') → 'pm_2' */
export function issueId(prefix: string): string {
  const db = getDb();
  return `${prefix}_${db.nextId++}`;
}

/** 로딩 상태(Suspense·isPending)를 관찰할 수 있도록 모든 핸들러에 주는 인위 지연. */
export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
