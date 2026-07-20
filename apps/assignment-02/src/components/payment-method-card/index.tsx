/** @jsxImportSource @emotion/react */
'use client';

import type { PaymentMethod } from '@/lib/types';

// 등록된 카드 하나를 라디오 시맨틱으로 보여주는 카드 (PlanCard와 같은 패턴).
// 카드번호는 서버가 마스킹한 값만 내려주므로 여기서 가공하지 않는다.
export function PaymentMethodCard({
  paymentMethod,
  selected,
  onSelect,
}: {
  paymentMethod: PaymentMethod;
  selected: boolean;
  onSelect: (paymentMethodId: string) => void;
}) {
  return (
    <label
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        border: `2px solid ${selected ? '#2563eb' : '#e5e7eb'}`,
        backgroundColor: selected ? '#eff6ff' : '#fff',
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        name="payment-method"
        value={paymentMethod.id}
        checked={selected}
        onChange={() => onSelect(paymentMethod.id)}
        // 시각적으로 숨기되 스크린리더·키보드 접근은 유지한다. 선택 표시는 카드 테두리가 담당.
        css={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <span css={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{paymentMethod.brand}</span>
      <span css={{ fontSize: 15, letterSpacing: 0.5 }}>{paymentMethod.maskedCardNumber}</span>
    </label>
  );
}
