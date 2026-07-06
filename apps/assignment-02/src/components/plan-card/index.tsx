/** @jsxImportSource @emotion/react */
'use client';

import type { Plan } from '@/lib/types';

// 플랜 하나를 라디오 시맨틱으로 보여주는 카드.
// label로 카드 전체를 input과 연결해 클릭 영역과 접근성을 확보한다.
export function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: (planId: string) => void;
}) {
  return (
    <label
      css={{
        display: 'block',
        padding: 16,
        borderRadius: 12,
        border: `2px solid ${selected ? '#2563eb' : '#e5e7eb'}`,
        backgroundColor: selected ? '#eff6ff' : '#fff',
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        name="plan"
        value={plan.id}
        checked={selected}
        onChange={() => onSelect(plan.id)}
        // 시각적으로 숨기되 스크린리더·키보드 접근은 유지한다. 선택 표시는 카드 테두리가 담당.
        css={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong css={{ fontSize: 17 }}>{plan.name}</strong>
        <span css={{ fontSize: 16, fontWeight: 700 }}>
          월 {plan.pricePerMonth.toLocaleString('ko-KR')}원
        </span>
      </div>
      <p css={{ margin: '6px 0 10px', fontSize: 14, color: '#555' }}>{plan.description}</p>
      <ul css={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </label>
  );
}
