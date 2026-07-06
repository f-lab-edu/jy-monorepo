import { NextResponse } from 'next/server';

import { isValidCardNumber, maskCardNumber } from '@/lib/card';
import { delay, getDb, issueId } from '@/lib/server/db';
import { isRecord, readJsonBody } from '@/lib/server/request';
import type { PaymentMethod } from '@/lib/types';

/** GET /api/payment-methods — 등록된 카드 목록 */
export async function GET() {
  await delay();
  return NextResponse.json(getDb().paymentMethods);
}

/**
 * POST /api/payment-methods — 새 카드 등록.
 * 원본 카드번호는 저장하지 않고 마스킹된 값만 보관한다 (실무 관례 학습 포인트).
 */
export async function POST(request: Request) {
  await delay();
  const body = await readJsonBody(request);
  if (!isRecord(body) || typeof body.cardNumber !== 'string') {
    return NextResponse.json({ message: '카드번호를 입력해 주세요.' }, { status: 400 });
  }
  if (!isValidCardNumber(body.cardNumber)) {
    return NextResponse.json({ message: '카드번호는 숫자 16자리여야 합니다.' }, { status: 400 });
  }

  const created: PaymentMethod = {
    id: issueId('pm'),
    brand: 'VISA', // BIN 판별은 과제 범위 밖이라 고정값으로 단순화 (CLAUDE.md 미결 4)
    maskedCardNumber: maskCardNumber(body.cardNumber),
    createdAt: new Date().toISOString(),
  };
  getDb().paymentMethods.push(created);
  return NextResponse.json(created, { status: 201 });
}
