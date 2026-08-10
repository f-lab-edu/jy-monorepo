/** @jsxImportSource @emotion/react */
'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

import { radioChipStyle, radioInputStyle } from '@/components/radio-group/radio-group.styles';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps extends UseFormRegisterReturn {
  options: RadioOption[];
}

// 칩 스타일 라디오 그룹. RHF register 반환값을 그대로 스프레드해 연결한다.
// 같은 name의 라디오 ref들은 RHF가 내부에서 배열(refs)로 수집하므로
// 하나의 register 결과를 모든 인풋이 공유해도 된다.
export function RadioGroup({ options, ...inputProps }: RadioGroupProps) {
  return (
    <div css={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(({ value, label }) => (
        <label key={value} css={radioChipStyle}>
          <input type="radio" value={value} css={radioInputStyle} {...inputProps} />
          {label}
        </label>
      ))}
    </div>
  );
}
