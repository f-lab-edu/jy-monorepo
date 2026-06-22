import { CharacterList } from '@/components/character-list';
import { ListBoundary } from '@/components/list-boundary';
import { SearchForm } from '@/components/search-form';

// 페이지네이션 목록 페이지(서버 컴포넌트).
// searchParams의 page·name을 읽어 검증한 뒤 검색 폼과 목록에 전달한다.
// 페이지·검색 상태를 URL로 관리하므로 새로고침·공유·뒤로가기에 그대로 보존된다.
export default async function PaginationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; name?: string }>;
}) {
  const { page, name } = await searchParams;
  const parsed = Number(page);
  // 양의 정수가 아니면 1페이지로 보정한다(잘못된 쿼리스트링 방어).
  const currentPage = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  const searchName = name ?? '';

  return (
    <main>
      <h1>페이지네이션 목록</h1>
      <SearchForm defaultName={searchName} />
      <ListBoundary fallback={<p>불러오는 중…</p>}>
        <CharacterList page={currentPage} name={searchName} />
      </ListBoundary>
    </main>
  );
}
