'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Form, Input, SubmitButton } from './search-form.styles';

interface SearchFormValues {
  name: string;
}

// 방법 A: submit 버튼 + handleSubmit일 때만 검색을 반영한다.
// watch를 쓰면 "제출 시점에만 검색"이라는 의도와 충돌하므로 사용하지 않는다.
export function SearchForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: { name: defaultName },
  });

  // 제출 시점에만 검색어를 URL에 반영한다. 새 검색이므로 page는 1로 초기화한다.
  const onSubmit = handleSubmit(({ name }) => {
    const params = new URLSearchParams();
    const trimmed = name.trim();
    if (trimmed) params.set('name', trimmed);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  });

  return (
    <Form onSubmit={onSubmit}>
      <Input {...register('name')} placeholder="캐릭터 이름 검색" />
      <SubmitButton type="submit">검색</SubmitButton>
    </Form>
  );
}
