/** @jsxImportSource @emotion/react */
'use client';

import type { Coupon } from '@/lib/types';

// 쿠폰 하나의 할인 조건을 사람이 읽는 문구로 만든다.
function describeDiscount(coupon: Coupon): string {
  return coupon.discountType === 'percent'
    ? `${coupon.value}% 할인`
    : `${coupon.value.toLocaleString('ko-KR')}원 할인`;
}

// 쿠폰 선택 목록. "쿠폰 미사용"(null)을 포함해 항상 하나가 선택된 상태를 유지한다.
export function CouponSelect({
  coupons,
  couponId,
  onSelect,
}: {
  coupons: Coupon[];
  couponId: string | null;
  onSelect: (couponId: string | null) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="쿠폰"
      css={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <CouponOption selected={couponId === null} onSelect={() => onSelect(null)} label="쿠폰 미사용" />
      {coupons.map((coupon) => (
        <CouponOption
          key={coupon.id}
          selected={coupon.id === couponId}
          onSelect={() => onSelect(coupon.id)}
          label={coupon.name}
          hint={describeDiscount(coupon)}
        />
      ))}
    </div>
  );
}

// 이 목록에서만 쓰이는 한 줄짜리 옵션이라 같은 파일에 둔다.
function CouponOption({
  selected,
  onSelect,
  label,
  hint,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        borderRadius: 10,
        border: `2px solid ${selected ? '#2563eb' : '#e5e7eb'}`,
        backgroundColor: selected ? '#eff6ff' : '#fff',
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        name="coupon"
        checked={selected}
        onChange={onSelect}
        css={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <span css={{ fontSize: 14 }}>{label}</span>
      {hint && <span css={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{hint}</span>}
    </label>
  );
}
