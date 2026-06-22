'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { CharacterCard } from '@/components/character-card';
import { Pagination } from '@/components/pagination';
import { charactersQuery } from '@/lib/rick-and-morty';

import { EmptyState, Grid } from './character-list.styles';

// 특정 페이지·검색어의 캐릭터 목록과 페이지네이션을 렌더한다.
// useSuspenseQuery를 쓰므로 로딩은 상위 Suspense가, 에러는 상위 ErrorBoundary가 담당한다.
export function CharacterList({ page, name }: { page: number; name: string }) {
  const { data } = useSuspenseQuery(charactersQuery(page, name));

  // 검색 결과가 없으면 빈 상태 메시지를 보여준다(404가 빈 목록으로 변환됨).
  if (data.results.length === 0) {
    return <EmptyState>검색 결과가 없습니다.</EmptyState>;
  }

  return (
    <>
      <Grid>
        {data.results.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </Grid>
      <Pagination currentPage={page} totalPages={data.info.pages} />
    </>
  );
}
