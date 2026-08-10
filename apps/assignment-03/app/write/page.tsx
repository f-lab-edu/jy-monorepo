import { Suspense } from 'react';

import { RecordForm } from '@/components/record-form';

// useSearchParams를 쓰는 클라이언트 폼이라 정적 프리렌더에 Suspense 경계가 필요하다.
export default function WritePage() {
  return (
    <Suspense>
      <RecordForm />
    </Suspense>
  );
}
