'use client';

import { useMemo } from 'react';

export type AppearanceColor = 'pale' | 'straw' | 'gold' | 'amber' | 'mahogany';

const SEGMENTS: { key: AppearanceColor; hex: string; label: string }[] = [
  { key: 'pale', hex: '#FFEFAE', label: 'Pale' },
  { key: 'straw', hex: '#F7D25C', label: 'Straw' },
  { key: 'gold', hex: '#E29D2A', label: 'Gold' },
  { key: 'amber', hex: '#C15A2C', label: 'Amber' },
  { key: 'mahogany', hex: '#5F2B22', label: 'Mahogany' },
];

export default function AppearanceBar({
  value,
  onChange,
  className = '',
  showLabel = true,
}: {
  value: AppearanceColor | null;
  onChange: (v: AppearanceColor) => void;
  className?: string;
  showLabel?: boolean;
}) {
  const currentLabel = useMemo(
    () => SEGMENTS.find(s => s.key === value)?.label ?? '선택 없음',
    [value]
  );

  return (
    <div>
      {/* 막대형 색 바 (시안 그대로: 5등분, 라운드, 테두리만) */}
      <div
        className={`flex h-6 sm:h-7 w-full overflow-hidden rounded-md ring-1 ring-gray-200 ${className}`}
        role="radiogroup"
        aria-label="Appearance color"
      >
        {SEGMENTS.map(s => (
          <button
            key={s.key}
            type="button"
            title={s.label}
            aria-checked={value === s.key}
            role="radio"
            onClick={() => onChange(s.key)}
            className="flex-1 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            style={{ backgroundColor: s.hex }}
          />
        ))}
      </div>

      {/* 선택 결과 표기 (막대는 그대로 두고, 텍스트로만 피드백) */}
      {showLabel && <div className="mt-2 text-xs text-gray-600">선택: {currentLabel}</div>}
    </div>
  );
}
