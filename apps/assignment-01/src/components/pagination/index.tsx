'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Nav, PageButton, PageText } from './pagination.styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

// 이전/다음 버튼으로 ?page= 를 갱신한다.
// 페이지 상태의 단일 출처(single source of truth)는 URL이며, 여기선 URL만 바꾼다.
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = (page: number) => {
    // 기존 쿼리스트링을 보존한 채 page만 교체한다(추후 검색어 등과 공존하기 위함).
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <Nav>
      <PageButton onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>
        이전
      </PageButton>
      <PageText>
        {currentPage} / {totalPages}
      </PageText>
      <PageButton onClick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}>
        다음
      </PageButton>
    </Nav>
  );
}
