/** @jsxImportSource @emotion/react */
'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MutationErrorAlert } from '@/components/mutation-error-alert';
import { fetchJson } from '@/lib/api-client';
import { STEP_PATHS } from '@/lib/funnel';
import { userQueryOptions } from '@/lib/queries';
import type { UpdateUserBody, User } from '@/lib/types';
import { useSubscriptionStore } from '@/store/subscription-store';

// 서버(app/api/user/route.ts)의 검증 규칙과 동일하게 맞춘다.
// 클라이언트에서 먼저 걸러 불필요한 요청·왕복을 줄이되, 최종 판정은 서버가 한다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01[016789]-\d{3,4}-\d{4}$/;

// Step2 본문: 서버 프로필을 폼 기본값으로 채우고, "완료" 시에만 PUT으로 서버에 반영한다.
// 이 단계만 예외적으로 서버에 즉시 저장한다(나머지 선택값은 완료 전까지 클라이언트 보관).
export function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(userQueryOptions);
  const completeProfile = useSubscriptionStore((state) => state.completeProfile);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserBody>({
    defaultValues: { name: user.name, email: user.email, phone: user.phone },
  });

  const mutation = useMutation({
    mutationFn: (body: UpdateUserBody) =>
      fetchJson<User>('/api/user', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      // 서버 반영본을 캐시에 다시 반영해 이후 화면(Checkout 요약)이 최신값을 읽게 한다.
      await queryClient.invalidateQueries({ queryKey: userQueryOptions.queryKey });
      goNext();
    },
  });

  function goNext() {
    completeProfile();
    router.push(STEP_PATHS.payment);
  }

  const onSubmit = handleSubmit((values) => {
    // 변경이 없으면 PUT은 낭비이므로 건너뛰고 바로 다음 단계로 넘어간다(무변경 완료 경로).
    if (!isDirty) {
      goNext();
      return;
    }
    mutation.mutate(values);
  });

  return (
    <form
      onSubmit={onSubmit}
      // 검증은 RHF에 일임한다. noValidate가 없으면 type="email" 등 브라우저 네이티브 검증이
      // 제출을 먼저 가로채 RHF 규칙·에러 UI가 실행되지 않는다.
      noValidate
      css={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}
    >
      <Field label="이름" error={errors.name?.message}>
        <input
          {...register('name', {
            required: '이름을 입력해 주세요.',
            setValueAs: (value: string) => value.trim(),
          })}
          css={inputStyle}
        />
      </Field>
      <Field label="이메일" error={errors.email?.message}>
        <input
          type="email"
          {...register('email', {
            required: '이메일을 입력해 주세요.',
            pattern: { value: EMAIL_PATTERN, message: '이메일 형식이 올바르지 않습니다.' },
          })}
          css={inputStyle}
        />
      </Field>
      <Field label="휴대폰" error={errors.phone?.message}>
        <input
          {...register('phone', {
            required: '휴대폰 번호를 입력해 주세요.',
            pattern: {
              value: PHONE_PATTERN,
              message: '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
            },
          })}
          placeholder="010-1234-5678"
          css={inputStyle}
        />
      </Field>

      <MutationErrorAlert error={mutation.error} fallback="프로필 저장에 실패했습니다." />

      <button
        type="submit"
        disabled={mutation.isPending}
        css={{
          padding: '14px 0',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          '&:disabled': { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
        }}
      >
        {mutation.isPending ? '저장 중…' : '완료'}
      </button>
    </form>
  );
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 15,
} as const;

// 라벨 + 입력 + 에러 메시지를 묶는 한 파일 내 로컬 조각(재사용 범위가 이 폼뿐이라 밖으로 빼지 않는다).
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label css={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span css={{ fontSize: 14, color: '#374151' }}>{label}</span>
      {children}
      {error && <span css={{ fontSize: 13, color: '#dc2626' }}>{error}</span>}
    </label>
  );
}
