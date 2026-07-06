import { NextResponse } from 'next/server';

import { delay, getDb } from '@/lib/server/db';
import { isRecord, readJsonBody } from '@/lib/server/request';
import type { UpdateUserBody } from '@/lib/types';

/** GET /api/user — 로그인한 사용자 프로필 (로그인은 이미 됐다고 가정) */
export async function GET() {
  await delay();
  return NextResponse.json(getDb().user);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01[016789]-\d{3,4}-\d{4}$/;

function validateUserBody(body: unknown): UpdateUserBody | string {
  if (!isRecord(body)) return '요청 본문이 올바른 JSON 객체가 아닙니다.';
  const { name, email, phone } = body;
  if (typeof name !== 'string' || name.trim().length === 0) return '이름을 입력해 주세요.';
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) return '이메일 형식이 올바르지 않습니다.';
  if (typeof phone !== 'string' || !PHONE_PATTERN.test(phone))
    return '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
  return { name: name.trim(), email, phone };
}

/** PUT /api/user — 프로필 수정 (Step2에서 즉시 서버 반영되는 유일한 쓰기) */
export async function PUT(request: Request) {
  await delay();
  const result = validateUserBody(await readJsonBody(request));
  if (typeof result === 'string') {
    return NextResponse.json({ message: result }, { status: 400 });
  }
  const db = getDb();
  db.user = { ...db.user, ...result };
  return NextResponse.json(db.user);
}
