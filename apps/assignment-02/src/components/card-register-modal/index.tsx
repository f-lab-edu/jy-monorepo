/** @jsxImportSource @emotion/react */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { fetchJson } from '@/lib/api-client';
import { CARD_NUMBER_LENGTH, isValidCardNumber, normalizeCardNumber } from '@/lib/card';
import { paymentMethodsQueryOptions } from '@/lib/queries';
import type { PaymentMethod, RegisterCardBody } from '@/lib/types';

// 새 카드 등록 모달.
// 네이티브 <dialog>를 써서 ESC 닫기·포커스 트랩·backdrop을 브라우저에 위임한다.
export function CardRegisterModal({
  open,
  onClose,
  onRegistered,
}: {
  open: boolean;
  onClose: () => void;
  /** 등록 성공 시 새 카드 id를 알려 부모가 곧바로 선택하게 한다. */
  onRegistered: (paymentMethodId: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterCardBody>({ defaultValues: { cardNumber: '' } });

  // open prop과 <dialog>의 실제 상태를 맞춘다. showModal()이어야 backdrop·포커스 트랩이 켜진다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const mutation = useMutation({
    mutationFn: (body: RegisterCardBody) =>
      fetchJson<PaymentMethod>('/api/payment-methods', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // 서버가 정규화하지만, 보내는 값도 숫자만 남겨 의도를 분명히 한다.
        body: JSON.stringify({ cardNumber: normalizeCardNumber(body.cardNumber) }),
      }),
    onSuccess: async (created) => {
      // 목록 캐시를 무효화해 새 카드가 반영되게 한다.
      await queryClient.invalidateQueries({ queryKey: paymentMethodsQueryOptions.queryKey });
      // 자동 선택은 refetch 완료를 기다리지 않고 POST 응답의 id로 즉시 처리한다.
      onRegistered(created.id);
      reset();
      onClose();
    },
  });

  function handleClose() {
    reset();
    mutation.reset();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      // ESC·backdrop으로 닫힐 때도 부모 상태를 동기화한다.
      onClose={handleClose}
      css={{
        width: 'min(90vw, 360px)',
        padding: 20,
        border: 'none',
        borderRadius: 12,
        '&::backdrop': { backgroundColor: 'rgba(0,0,0,0.4)' },
      }}
    >
      <h2 css={{ margin: '0 0 16px', fontSize: 18 }}>새 카드 등록</h2>
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        // 검증은 RHF에 일임한다(브라우저 네이티브 검증이 제출을 가로채지 않도록).
        noValidate
        css={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <label css={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span css={{ fontSize: 14, color: '#374151' }}>카드번호</span>
          <input
            {...register('cardNumber', {
              required: '카드번호를 입력해 주세요.',
              validate: (value) =>
                isValidCardNumber(value) || `카드번호는 숫자 ${CARD_NUMBER_LENGTH}자리여야 합니다.`,
            })}
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            css={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 15,
              letterSpacing: 0.5,
            }}
          />
          {errors.cardNumber && (
            <span css={{ fontSize: 13, color: '#dc2626' }}>{errors.cardNumber.message}</span>
          )}
        </label>

        {mutation.isError && (
          <p role="alert" css={{ margin: 0, fontSize: 13, color: '#dc2626' }}>
            {mutation.error instanceof Error ? mutation.error.message : '카드 등록에 실패했습니다.'}
          </p>
        )}

        <div css={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleClose}
            css={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            css={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              '&:disabled': { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
            }}
          >
            {mutation.isPending ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
