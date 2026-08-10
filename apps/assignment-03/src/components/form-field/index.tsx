/** @jsxImportSource @emotion/react */
'use client';

import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}

// 라벨 + 인풋 슬롯 + 하단 에러 메시지(심화 요구사항).
// 붉은 아웃라인은 각 인풋의 aria-invalid 속성 + 공용 인풋 스타일이 담당한다.
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <label htmlFor={htmlFor} css={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" css={{ fontSize: 13, color: '#dc2626', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}
