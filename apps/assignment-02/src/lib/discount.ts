import type { Coupon } from '@/lib/types';

/**
 * 쿠폰 적용 후 최종 가격(월 요금 1회분 기준).
 * 서버(checkout 재계산)와 클라이언트(가격 미리보기)가 이 함수 하나를 공유해
 * 표시 가격과 청구 가격이 어긋나지 않게 한다.
 * - 정률(percent): 할인액은 원 단위 내림
 * - 정액(amount): 0원 하한
 */
export function calculateDiscountedPrice(price: number, coupon: Coupon | null): number {
  if (!coupon) return price;
  if (coupon.discountType === 'percent') {
    return price - Math.floor((price * coupon.value) / 100);
  }
  return Math.max(0, price - coupon.value);
}
