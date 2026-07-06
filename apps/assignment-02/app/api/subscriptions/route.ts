import { NextResponse } from 'next/server';

import { delay, getDb } from '@/lib/server/db';

/** GET /api/subscriptions — 구독 플랜 목록 */
export async function GET() {
  await delay();
  return NextResponse.json(getDb().plans);
}
