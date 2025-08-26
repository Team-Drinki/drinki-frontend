'use client';

import { useEffect, useMemo, useState } from 'react';

export type AppearanceColor = 'pale' | 'straw' | 'gold' | 'amber' | 'mahogany';

/**
 * PALETTE: 초심자용(5범주) + 고급용(세부 셰이드) 색상/라벨의 단일 소스
 * - baseHex: 초심자 모드에서 각 범주의 배경색
 * - shades: 고급 모드에서 표시되는 세부 구간(좌→우 순서)
 */
const PALETTE: {
  key: AppearanceColor;
  label: string;
  baseHex: string;
  shades: { hex: string; label: string }[];
}[] = [
  {
    key: 'pale',
    label: 'Pale',
    baseHex: '#FFEFAE',
    shades: [
      { hex: '#FFF7E0', label: 'Pale Straw (옅은 짚색)' },
      { hex: '#FFF0C8', label: 'Straw (짚색)' },
      { hex: '#FFE9AF', label: 'Pale Gold (옅은 금색)' },
      { hex: '#FFE297', label: 'Light Gold (연한 금색)' },
    ],
  },
  {
    key: 'straw',
    label: 'Straw',
    baseHex: '#F7D25C',
    shades: [
      { hex: '#FFDA7F', label: 'Gold (금색)' },
      { hex: '#F7D25C', label: 'Deep Gold (짙은 금색)' },
      { hex: '#F2C74A', label: 'Old Gold (올드 골드)' },
    ],
  },
  {
    key: 'gold',
    label: 'Gold',
    baseHex: '#E29D2A',
    shades: [
      { hex: '#EABA38', label: 'Burnished Gold (광택 금색)' },
      { hex: '#E29D2A', label: 'Amber (호박색)' },
      { hex: '#D88426', label: 'Deep Amber (짙은 호박색)' },
    ],
  },
  {
    key: 'amber',
    label: 'Amber',
    baseHex: '#C15A2C',
    shades: [
      { hex: '#CF6B2C', label: 'Burnished Copper (광택 구리색)' },
      { hex: '#C4552E', label: 'Copper (구리색)' },
      { hex: '#B4442F', label: 'Russet / Chestnut (밤빛 갈색)' },
    ],
  },
  {
    key: 'mahogany',
    label: 'Mahogany',
    baseHex: '#5F2B22',
    shades: [
      { hex: '#9F372D', label: 'Mahogany (마호가니)' },
      { hex: '#7A2D26', label: 'Old Oak (올드 오크)' },
      { hex: '#4A1E1A', label: 'Treacle (당밀색/매우 진한 갈색)' },
    ],
  },
];
// 범주 키 -> 범주 라벨 매핑 (초심자)
const LABELS: Record<AppearanceColor, string> = Object.fromEntries(
  PALETTE.map(s => [s.key, s.label])
) as Record<AppearanceColor, string>;

/**
 * FLAT_SHADES: 고급 모드 렌더를 위해 모든 셰이드를 1차원 배열로 평탄화
 * - segKey: 이 셰이드가 속한 5범주 키
 * - idx: 전체 막대에서의 전역 인덱스 (좌->우)
 */

const FLAT_SHADES = (() => {
  const out: { hex: string; label: string; segKey: AppearanceColor; idx: number }[] = [];
  let idx = 0;
  for (const seg of PALETTE) {
    for (const shade of seg.shades) {
      out.push({ hex: shade.hex, label: shade.label, segKey: seg.key, idx });
      idx += 1;
    }
  }
  return out;
})();

/**
 * SEGMENT_INDEX: 각 5범주가 차지하는 전역 인덱스 구간과 대표 인덱스(가운데 값)
 * - start/end: FLAT_SHADES에서의 시작/끝 인덱스
 * - rep: 시각적 강조에 사용할 대표 인덱스(가운데)
 */

const SEGMENT_INDEX: Record<AppearanceColor, { start: number; end: number; rep: number }> = (() => {
  const map = {} as Record<AppearanceColor, { start: number; end: number; rep: number }>;
  let cursor = 0;
  for (const seg of PALETTE) {
    const count = seg.shades.length;
    const start = cursor;
    const end = cursor + count - 1;
    const rep = Math.round((start + end) / 2);
    map[seg.key] = { start, end, rep };
    cursor = end + 1;
  }
  return map;
})();

/** 전역 인덱스 -> 해당하는 5범주 키 */
function binOfIndex(globalIdx: number): AppearanceColor {
  for (const seg of PALETTE) {
    const { start, end } = SEGMENT_INDEX[seg.key];
    if (globalIdx >= start && globalIdx <= end) return seg.key;
  }
  return 'gold';
}

/** 5범주 키 -> 대표 인덱스(가운데 칸) */
function representativeIndexOfBin(key: AppearanceColor): number {
  return SEGMENT_INDEX[key].rep;
}

export default function AppearanceBar({
  value,
  onChange,
  className = '',
  showLabel = true,
  detailed = false,
}: {
  value: AppearanceColor | null; // 현재 선택된 5범주
  onChange: (v: AppearanceColor) => void;
  className?: string;
  showLabel?: boolean; // 하단 라벨 표시 여부
  detailed?: boolean; // true = expert, false = beginner
}) {
  const [shadeIdx, setShadeIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!detailed) {
      setShadeIdx(null);
      return;
    }
    if (value) {
      setShadeIdx(prev => (prev === null ? representativeIndexOfBin(value) : prev));
    } else {
      setShadeIdx(null);
    }
  }, [detailed, value]);

  const labelToShow = useMemo(() => {
    if (detailed && shadeIdx !== null && FLAT_SHADES[shadeIdx]) {
      return FLAT_SHADES[shadeIdx].label;
    }
    return value ? LABELS[value] : '선택 없음';
  }, [detailed, shadeIdx, value]);

  const selectedIdx = useMemo(() => {
    if (!detailed) return -1;
    if (shadeIdx !== null) return shadeIdx;
    return value ? representativeIndexOfBin(value) : -1;
  }, [detailed, shadeIdx, value]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full h-6 sm:h-7 md:h-8 rounded-full overflow-hidden border border-gray-300 bg-white"
        role="radiogroup"
        aria-label="Appearance"
      >
        <div className="flex h-full">
          {detailed // expert mode
            ? FLAT_SHADES.map((s, i) => {
                const isSelected = i === selectedIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-checked={isSelected}
                    role="radio"
                    onClick={() => {
                      setShadeIdx(i);
                      onChange(binOfIndex(i));
                    }}
                    className="flex-1 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer"
                    style={{
                      backgroundColor: s.hex,

                      boxShadow: isSelected ? 'inset 0 0 0 3px #000' : undefined,
                    }}
                    title={s.label}
                  />
                );
              })
            : // beginner mode
              PALETTE.map(seg => {
                const isSelected = value === seg.key;
                return (
                  <button
                    key={seg.key}
                    type="button"
                    aria-checked={isSelected}
                    role="radio"
                    onClick={() => onChange(seg.key)}
                    className="flex-1 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer"
                    style={{
                      backgroundColor: seg.baseHex,

                      boxShadow: isSelected ? 'inset 0 0 0 3px #000' : undefined,
                    }}
                    title={seg.label}
                  />
                );
              })}
        </div>
      </div>

      {showLabel && <div className="mt-2 text-xs text-gray-600">선택: {labelToShow}</div>}
    </div>
  );
}
