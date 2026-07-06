import { NextResponse } from 'next/server';

import { calculateDiscountedPrice } from '@/lib/discount';
import { delay, getDb, issueId } from '@/lib/server/db';
import { isRecord, readJsonBody } from '@/lib/server/request';
import type { Subscription } from '@/lib/types';

/**
 * POST /api/subscriptions/checkout — 최종 구독 확정.
 * 클라이언트가 보낸 가격은 신뢰하지 않는다: ID들을 저장소에서 재검증하고
 * 최종 가격은 서버가 다시 계산한다 (실무 관례 학습 포인트).
 */
export async function POST(request: Request) {
  await delay();
  const body = await readJsonBody(request);
  if (
    !isRecord(body) ||
    typeof body.planId !== 'string' ||
    typeof body.paymentMethodId !== 'string' ||
    (body.couponId !== null && typeof body.couponId !== 'string')
  ) {
    return NextResponse.json({ message: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const db = getDb();
  const plan = db.plans.find((p) => p.id === body.planId);
  if (!plan) {
    return NextResponse.json({ message: '존재하지 않는 플랜입니다.' }, { status: 400 });
  }
  const paymentMethod = db.paymentMethods.find((pm) => pm.id === body.paymentMethodId);
  if (!paymentMethod) {
    return NextResponse.json({ message: '존재하지 않는 결제수단입니다.' }, { status: 400 });
  }
  const coupon = body.couponId === null ? null : db.coupons.find((c) => c.id === body.couponId);
  if (coupon === undefined) {
    return NextResponse.json({ message: '존재하지 않는 쿠폰입니다.' }, { status: 400 });
  }

  const subscription: Subscription = {
    id: issueId('sub'),
    planId: plan.id,
    paymentMethodId: paymentMethod.id,
    couponId: coupon?.id ?? null,
    originalPrice: plan.pricePerMonth,
    finalPrice: calculateDiscountedPrice(plan.pricePerMonth, coupon),
    subscribedAt: new Date().toISOString(),
  };
  db.subscriptions.push(subscription);
  return NextResponse.json(subscription, { status: 201 });
}
