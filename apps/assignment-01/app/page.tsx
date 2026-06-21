import Link from 'next/link';

// 두 목록 페이지로 가는 최소한의 인덱스. 실제 목록 UI는 이후 PR에서 추가한다.
export default function HomePage() {
  return (
    <main>
      <h1>목록 페이지 과제</h1>
      <nav>
        <ul>
          <li>
            <Link href="/pagination">페이지네이션 목록</Link>
          </li>
          <li>
            <Link href="/infinite">무한스크롤 목록</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
