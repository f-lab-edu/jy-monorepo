/** @jsxImportSource @emotion/react */
'use client';

import { useFormContext } from 'react-hook-form';

import { FormField } from '@/components/form-field';
import { RadioGroup } from '@/components/radio-group';
import {
  VISIBILITY_CHOICES,
  VISIBILITY_LABELS,
  type ReadingRecordFormValues,
} from '@/lib/reading-record';

// 공개 여부 라디오 옵션 (도메인 정의 순서 유지).
const VISIBILITY_OPTIONS = VISIBILITY_CHOICES.map((value) => ({
  value,
  label: VISIBILITY_LABELS[value],
}));

// Step5 — 공개 여부. 공개 범위는 기본값으로 지나치면 안 되는 성격의 필드라
// null로 시작해 의식적 선택을 강제한다(status·recommend와 동일한 패턴).
export function VisibilityStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReadingRecordFormValues>();

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FormField label="이 독서 기록을 공개할까요?" error={errors.visibility?.message}>
        <RadioGroup
          options={VISIBILITY_OPTIONS}
          {...register('visibility', { required: '공개 여부를 선택해 주세요.' })}
        />
      </FormField>
      <p css={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
        전체 공개를 선택하면 다른 사용자가 이 기록을 볼 수 있습니다. 공개 범위는 작성 후에도 바꿀 수
        있습니다.
      </p>
    </div>
  );
}
