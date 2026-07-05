'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { CharacterCard } from '@/components/character-card';
import { useDebounce } from '@/hooks/use-debounce';
import { charactersQuery } from '@/lib/rick-and-morty';

import { EmptyState, Grid, Input, Nav, PageButton, PageText } from './live-search-list.styles';

// 방법 B: submit 없이 입력값을 debounce하여 검색한다.
// 검색어 유무는 useQuery의 enabled로 제어해, 빈 검색어일 땐 요청 자체를 막는다.
// (방법 A와 달리 상태를 URL이 아니라 로컬 state로 들고, Suspense 대신 non-suspense로 처리한다.)
export function LiveSearchList() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  // 입력이 멎은 뒤의 최종 검색어만 쿼리에 반영한다(타이핑마다 요청하지 않기 위함).
  const debouncedKeyword = useDebounce(keyword, 300);
  const trimmed = debouncedKeyword.trim();

  // 검색어가 바뀌면 항상 1페이지부터 다시 본다(이전 검색의 페이지 위치를 물려받지 않도록).
  useEffect(() => {
    setPage(1);
  }, [trimmed]);

  const { data, isError, refetch } = useQuery({
    ...charactersQuery(page, trimmed),
    // 검색어가 있을 때만 요청한다. 빈 검색어면 쿼리를 실행하지 않는다(불필요한 요청 차단).
    enabled: trimmed.length > 0,
  });

  let body: ReactNode;
  if (trimmed.length === 0) {
    // 검색어 입력 전: 요청하지 않으므로 안내만 한다.
    body = <EmptyState>검색어를 입력하세요.</EmptyState>;
  } else if (isError) {
    body = (
      <EmptyState>
        불러오지 못했습니다. <PageButton onClick={() => refetch()}>다시 시도</PageButton>
      </EmptyState>
    );
  } else if (!data) {
    // enabled가 켜졌지만 아직 첫 응답이 없는 상태.
    body = <EmptyState>불러오는 중…</EmptyState>;
  } else if (data.results.length === 0) {
    // 404를 빈 목록으로 변환한 결과(검색 결과 없음).
    body = <EmptyState>검색 결과가 없습니다.</EmptyState>;
  } else {
    body = (
      <>
        <Grid>
          {data.results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </Grid>
        <Nav>
          <PageButton onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            이전
          </PageButton>
          <PageText>
            {page} / {data.info.pages}
          </PageText>
          <PageButton onClick={() => setPage((p) => p + 1)} disabled={page >= data.info.pages}>
            다음
          </PageButton>
        </Nav>
      </>
    );
  }

  return (
    <>
      <Input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="캐릭터 이름 검색"
      />
      {body}
    </>
  );
}
