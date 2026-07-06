// 구독 퍼널 전반에서 쓰는 도메인 모델.
// 서버(Route Handlers)와 클라이언트가 같은 타입을 공유한다.

export type Plan = {
  id: string;
  name: string;
  description: string;
  /** 월 요금, 원 단위 정수 */
  pricePerMonth: number;
  features: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  /** 서버는 마스킹된 값만 저장·응답한다 (원본 카드번호 미보관) */
  maskedCardNumber: string;
  createdAt: string;
};

export type Coupon = {
  id: string;
  name: string;
  /** percent: %할인(정률), amount: 원 할인(정액) */
  discountType: 'percent' | 'amount';
  value: number;
};

export type Subscription = {
  id: string;
  planId: string;
  paymentMethodId: string;
  couponId: string | null;
  originalPrice: number;
  finalPrice: number;
  subscribedAt: string;
};

/** PUT /api/user 요청 body */
export type UpdateUserBody = Pick<User, 'name' | 'email' | 'phone'>;

/** POST /api/payment-methods 요청 body */
export type RegisterCardBody = {
  /** 숫자 16자리 (공백·하이픈 허용, 서버에서 정규화) */
  cardNumber: string;
};

/** POST /api/subscriptions/checkout 요청 body */
export type CheckoutBody = {
  planId: string;
  paymentMethodId: string;
  couponId: string | null;
};
