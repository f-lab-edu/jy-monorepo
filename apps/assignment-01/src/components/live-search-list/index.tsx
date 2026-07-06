/** @jsxImportSource @emotion/react */
'use client';

import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { CharacterCard } from '@/components/character-card';
import { useDebounce } from '@/hooks/use-debounce';
import { charactersQuery } from '@/lib/rick-and-morty';

// 이전/다음/다시 시도에서 반복 쓰이는 버튼 스타일만 상수로 둔다.
const pageButtonStyle = css`
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// 안내·로딩·결과 없음 등 상태 문구에 공통으로 쓰는 스타일.
const messageStyle = css`
  padding: 48px;
  text-align: center;
  color: #666;
`;

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
    body = <p css={messageStyle}>검색어를 입력하세요.</p>;
  } else if (isError) {
    body = (
      <p css={messageStyle}>
        불러오지 못했습니다.{' '}
        <button type="button" css={pageButtonStyle} onClick={() => refetch()}>
          다시 시도
        </button>
      </p>
    );
  } else if (!data) {
    // enabled가 켜졌지만 아직 첫 응답이 없는 상태.
    body = <p css={messageStyle}>불러오는 중…</p>;
  } else if (data.results.length === 0) {
    // 404를 빈 목록으로 변환한 결과(검색 결과 없음).
    body = <p css={messageStyle}>검색 결과가 없습니다.</p>;
  } else {
    body = (
      <>
        <ul
          css={css`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
            margin: 0;
            padding: 0;
          `}
        >
          {data.results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </ul>
        <nav
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 24px;
          `}
        >
          <button
            type="button"
            css={pageButtonStyle}
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            이전
          </button>
          <span
            css={css`
              min-width: 60px;
              text-align: center;
            `}
          >
            {page} / {data.info.pages}
          </span>
          <button
            type="button"
            css={pageButtonStyle}
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.info.pages}
          >
            다음
          </button>
        </nav>
      </>
    );
  }

  return (
    <>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="캐릭터 이름 검색"
        css={css`
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 24px;
          border: 1px solid #ccc;
          border-radius: 6px;
        `}
      />
      {body}
    </>
  );
}
