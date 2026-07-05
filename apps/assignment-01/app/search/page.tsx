import { LiveSearchList } from '@/components/live-search-list';

// 방법 B(검색) 페이지: submit 없이 debounce된 입력으로 실시간 검색한다.
// 상태를 클라이언트 로컬 state로 들고 non-suspense useQuery + enabled로 처리하므로,
// 이 서버 컴포넌트는 셸(제목)만 그리고 목록은 클라이언트 컴포넌트에 위임한다.
export default function SearchPage() {
  return (
    <main>
      <h1>실시간 검색 목록</h1>
      <LiveSearchList />
    </main>
  );
}
