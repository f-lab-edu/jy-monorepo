// Route Handler 공용 요청 파싱 헬퍼.

/** body가 JSON이 아니면 null을 반환한다 (request.json()은 파싱 실패 시 throw). */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** unknown body를 객체로 좁히기 위한 타입 가드. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
