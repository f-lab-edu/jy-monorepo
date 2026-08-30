import type { ReactNode } from 'react';

/**
 * 빈 상태 경계를 캡슐화한 제네릭 목록 컴포넌트.
 *
 * "목록이 비면 fallback, 있으면 항목 렌더"라는 반복 패턴을 선언적으로 만든다 —
 * 사용처에서 삼항·length 분기가 사라지고 "빈 상태는 이것, 항목은 이렇게"만 남는다.
 *
 * key는 React 관례대로 호출자가 renderItem이 반환하는 요소에 직접 부여한다
 * (useFieldArray처럼 안정적인 key(field.id)를 호출자만 아는 경우가 많다).
 */
interface ListProps<T> {
  items: readonly T[];
  /** 목록이 비었을 때 대신 보여줄 내용. 생략하면 아무것도 렌더하지 않는다. */
  fallback?: ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
}

export function List<T>({ items, fallback, renderItem }: ListProps<T>) {
  if (items.length === 0) return <>{fallback}</>;
  return <>{items.map(renderItem)}</>;
}
