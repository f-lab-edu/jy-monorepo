import { InfiniteCharacterList } from '@/components/infinite-character-list';
import { ListBoundary } from '@/components/list-boundary';

// 무한스크롤 목록 페이지(서버 컴포넌트).
// 페이지 상태가 URL에 없으므로 searchParams 없이 목록을 공통 경계로 감싼다.
export default function InfinitePage() {
  return (
    <main>
      <h1>무한스크롤 목록</h1>
      <ListBoundary fallback={<p>불러오는 중…</p>}>
        <InfiniteCharacterList />
      </ListBoundary>
    </main>
  );
}
