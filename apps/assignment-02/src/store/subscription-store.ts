import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 퍼널 진행 중 선택값 저장소.
// 엔티티 원본이 아니라 **참조 ID만** 저장한다 — 화면은 ID로 서버 데이터를
// 다시 조회해 그리므로 stale 복제본이 생기지 않는다 (CLAUDE.md 상태 소유권 원칙).

type SubscriptionState = {
  planId: string | null;
  /** Step2 "완료" 클릭 여부. 프로필 데이터 자체는 서버 소유라 저장하지 않는다. */
  profileCompleted: boolean;
  paymentMethodId: string | null;
  /** 쿠폰은 미선택(null) 허용 */
  couponId: string | null;
  selectPlan: (planId: string) => void;
  completeProfile: () => void;
  selectPaymentMethod: (paymentMethodId: string) => void;
  selectCoupon: (couponId: string | null) => void;
  /** 구독 완료 후 초기화. 완료 신호는 store 밖(완료 토큰)에 둔다 — CLAUDE.md 완료 토큰 규약. */
  reset: () => void;
};

const initialSelection = {
  planId: null,
  profileCompleted: false,
  paymentMethodId: null,
  couponId: null,
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      ...initialSelection,
      selectPlan: (planId) => set({ planId }),
      completeProfile: () => set({ profileCompleted: true }),
      selectPaymentMethod: (paymentMethodId) => set({ paymentMethodId }),
      selectCoupon: (couponId) => set({ couponId }),
      reset: () => set(initialSelection),
    }),
    {
      name: 'subscription-funnel',
      // 새로고침·뒤로가기에는 유지되고 탭을 닫으면 사라지는 sessionStorage.
      // SSR에는 storage가 없으므로 함수로 감싸 클라이언트에서만 접근한다.
      storage: createJSONStorage(() => sessionStorage),
      // 액션 함수는 영속 대상이 아니므로 선택값만 저장한다.
      partialize: ({ planId, profileCompleted, paymentMethodId, couponId }) => ({
        planId,
        profileCompleted,
        paymentMethodId,
        couponId,
      }),
    },
  ),
);
