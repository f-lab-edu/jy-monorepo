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

// 특정 페이지의 캐릭터 목록을 가져온다.
// 실패 시 throw하여 상위 ErrorBoundary가 처리하도록 한다(여기서 잡지 않는다).
async function fetchCharacters(page: number): Promise<CharacterPage> {
  const response = await fetch(`${API_BASE}/character?page=${page}`);
  if (!response.ok) {
    throw new Error(`캐릭터 목록을 불러오지 못했습니다. (HTTP ${response.status})`);
  }
  return response.json() as Promise<CharacterPage>;
}

// 페이지별 쿼리 옵션. queryKey에 page를 포함해 페이지마다 캐시를 분리한다.
// queryOptions로 묶어 두면 목록과 페이지네이션이 같은 키를 공유해 캐시를 재사용한다.
export function charactersQuery(page: number) {
  return queryOptions({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
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
