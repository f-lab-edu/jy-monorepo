/** @jsxImportSource @emotion/react */
'use client';

interface StepPlaceholderProps {
  title: string;
  description: string;
}

// 각 스텝의 실제 필드가 구현되기 전까지 자리를 지키는 플레이스홀더.
export function StepPlaceholder({ title, description }: StepPlaceholderProps) {
  return (
    <div css={{ padding: '32px 0' }}>
      <h2 css={{ fontSize: 22, margin: '0 0 8px' }}>{title}</h2>
      <p css={{ fontSize: 15, lineHeight: 1.6, color: '#555', margin: 0 }}>{description}</p>
    </div>
  );
}
