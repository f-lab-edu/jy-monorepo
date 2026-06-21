'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { CharacterCard } from '@/components/character-card';
import { Pagination } from '@/components/pagination';
import { charactersQuery } from '@/lib/rick-and-morty';

import { Grid } from './character-list.styles';

// 특정 페이지의 캐릭터 목록과 페이지네이션을 렌더한다.
// useSuspenseQuery를 쓰므로 로딩은 상위 Suspense가, 에러는 상위 ErrorBoundary가 담당한다.
export function CharacterList({ page }: { page: number }) {
  const { data } = useSuspenseQuery(charactersQuery(page));

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
