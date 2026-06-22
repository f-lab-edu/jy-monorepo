import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// Rick and Morty API 응답 타입 (목록 렌더에 필요한 필드만 정의한다).
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
}

export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterPage {
  info: PageInfo;
  results: Character[];
}

const API_BASE = 'https://rickandmortyapi.com/api';

// 빈 검색 결과를 표현하는 빈 페이지. 404를 에러 대신 "결과 없음"으로 변환할 때 쓴다.
const EMPTY_PAGE: CharacterPage = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

// 캐릭터 목록을 가져온다. name이 있으면 검색 필터로 사용한다.
// 실패 시 throw하여 상위 ErrorBoundary가 처리하도록 한다(여기서 잡지 않는다).
async function fetchCharacters(page: number, name?: string): Promise<CharacterPage> {
  const params = new URLSearchParams({ page: String(page) });
  if (name) params.set('name', name);

  const response = await fetch(`${API_BASE}/character?${params.toString()}`);

  // 검색 결과가 없으면 Rick and Morty는 404를 반환한다.
  // 이는 에러가 아니라 "결과 없음"이므로 빈 목록으로 변환해 빈 상태 UI로 처리한다.
  if (response.status === 404) {
    return EMPTY_PAGE;
  }
  if (!response.ok) {
    throw new Error(`캐릭터 목록을 불러오지 못했습니다. (HTTP ${response.status})`);
  }
  return response.json() as Promise<CharacterPage>;
}

// 페이지별 쿼리 옵션. queryKey에 page·name을 포함해 조합마다 캐시를 분리한다.
export function charactersQuery(page: number, name: string) {
  return queryOptions({
    queryKey: ['characters', page, name],
    queryFn: () => fetchCharacters(page, name),
  });
}

// 무한스크롤용 쿼리 옵션.
// getNextPageParam은 다음에 불러올 페이지 번호를 반환하며, info.next가 null(마지막 페이지)이면
// undefined를 반환해 더 이상 요청하지 않는다.
export function charactersInfiniteQuery() {
  return infiniteQueryOptions({
    queryKey: ['characters', 'infinite'],
    queryFn: ({ pageParam }) => fetchCharacters(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.info.next ? lastPageParam + 1 : undefined,
  });
}
