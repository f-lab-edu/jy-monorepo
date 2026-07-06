// fetch 래퍼: 실패 응답을 서버가 내려준 message와 함께 throw해
// ErrorBoundary 폴백·mutation onError가 일관된 형태로 다루게 한다.

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    // Mock API는 실패 시 { message }를 내려준다. 형태가 다르면 상태 코드로 대체.
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
        ? body.message
        : `요청에 실패했습니다. (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return (await response.json()) as T;
}
