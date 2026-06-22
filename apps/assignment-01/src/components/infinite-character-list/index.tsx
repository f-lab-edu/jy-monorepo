'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { CharacterCard } from '@/components/character-card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { charactersInfiniteQuery } from '@/lib/rick-and-morty';

import { Grid, Sentinel } from './infinite-character-list.styles';

// 무한스크롤 캐릭터 목록.
// 여러 페이지를 하나의 배열로 평탄화해 렌더하고, 바닥의 센티넬이 보이면 다음 페이지를 불러온다.
export function InfiniteCharacterList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(charactersInfiniteQuery());

  // 센티넬이 보일 때 호출. 이미 불러오는 중이면 중복 요청을 막는다.
  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 더 불러올 페이지가 있을 때만 관찰을 활성화한다.
  const sentinelRef = useIntersectionObserver(handleIntersect, hasNextPage);

  // 페이지별 results를 하나의 배열로 합친다.
  const characters = data.pages.flatMap((page) => page.results);

  return (
    <>
      <Grid>
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </Grid>
      {hasNextPage && (
        <Sentinel ref={sentinelRef}>{isFetchingNextPage ? '불러오는 중…' : ''}</Sentinel>
      )}
    </>
  );
}
