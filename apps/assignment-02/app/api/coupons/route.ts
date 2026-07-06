import { NextResponse } from 'next/server';

import { delay, getDb } from '@/lib/server/db';

/** GET /api/coupons — 사용 가능한 쿠폰 목록 */
export async function GET() {
  await delay();
  return NextResponse.json(getDb().coupons);
}
