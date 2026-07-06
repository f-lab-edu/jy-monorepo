import type { Coupon, PaymentMethod, Plan, User } from '@/lib/types';

// 서버 기동 시점의 초기 데이터. db.ts의 싱글턴 생성에서만 사용한다.

export const seedPlans: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    description: '가볍게 시작하는 기본 플랜',
    pricePerMonth: 9900,
    features: ['콘텐츠 무제한 감상', '동시 접속 1명', '720p 화질'],
  },
  {
    id: 'plan_standard',
    name: 'Standard',
    description: '가장 많이 선택하는 플랜',
    pricePerMonth: 14900,
    features: ['콘텐츠 무제한 감상', '동시 접속 2명', '1080p 화질', '오프라인 저장'],
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    description: '가족과 함께 최고 화질로',
    pricePerMonth: 19900,
    features: ['콘텐츠 무제한 감상', '동시 접속 4명', '4K+HDR 화질', '오프라인 저장', '프로필 5개'],
  },
];

export const seedUser: User = {
  id: 'user_1',
  name: '김구독',
  email: 'subscriber@example.com',
  phone: '010-1234-5678',
};

export const seedPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    brand: 'VISA',
    maskedCardNumber: '4111 1111 1111 ****',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
];

export const seedCoupons: Coupon[] = [
  { id: 'coupon_percent_10', name: '첫 구독 10% 할인', discountType: 'percent', value: 10 },
  { id: 'coupon_percent_30', name: '컴백 회원 30% 할인', discountType: 'percent', value: 30 },
  { id: 'coupon_amount_3000', name: '3,000원 즉시 할인', discountType: 'amount', value: 3000 },
];
