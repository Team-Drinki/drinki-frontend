'use client';

import { useMemo, useState } from 'react';

type Props = {
  value: number; // 0 ~ max
  onChange: (v: number) => void; // 반단위(0.5)로 콜백
  max?: number; // 기본 5
  size?: number; // px 단위 아이콘 크기, 기본 28
  readOnly?: boolean;
};

export default function StarRating({
  value,
  onChange,
  max = 5,
  size = 28,
  readOnly = false,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

  const clampHalf = (n: number) => Math.max(0, Math.min(max, Math.round(n * 2) / 2));

  // 키보드 접근성(← → 로 0.5씩 조정)
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (e.key === 'ArrowLeft') onChange(clampHalf(value - 0.5));
    if (e.key === 'ArrowRight') onChange(clampHalf(value + 0.5));
  };

  return (
    <div
      className="flex items-center gap-2"
      onKeyDown={onKey}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={readOnly ? -1 : 0}
      onMouseLeave={() => setHover(null)}
    >
      {stars.map(idx => {
        // 이 별 하나의 채움 비율(0~100)
        const fillPercent = Math.max(0, Math.min(100, (display - (idx - 1)) * 100));
        // 왼/오 클릭 시 값
        const leftValue = clampHalf(idx - 0.5);
        const rightValue = clampHalf(idx);

        return (
          <div
            key={idx}
            className="relative"
            style={{ width: size, height: size, cursor: readOnly ? 'default' : 'pointer' }}
            aria-label={`${idx} star`}
          >
            {/* 회색 베이스 */}
            <StarSVG size={size} className="text-gray-300" />
            {/* 채워진 부분(퍼센트만큼 가림) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <StarSVG size={size} className="text-yellow-400" />
            </div>

            {/* 인터랙션 히트영역: 반씩 쪼개기 */}
            {!readOnly && (
              <>
                {/* 왼쪽 0.5 */}
                <button
                  type="button"
                  className="absolute left-0 top-0 h-full w-1/2"
                  aria-label={`${idx - 0.5} stars`}
                  onMouseEnter={() => setHover(leftValue)}
                  onFocus={() => setHover(leftValue)}
                  onClick={() => onChange(leftValue)}
                />
                {/* 오른쪽 0.5 */}
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full w-1/2"
                  aria-label={`${idx} stars`}
                  onMouseEnter={() => setHover(rightValue)}
                  onFocus={() => setHover(rightValue)}
                  onClick={() => onChange(rightValue)}
                />
              </>
            )}
          </div>
        );
      })}
      <span className="text-sm text-gray-600">
        {value}/{max}
      </span>
    </div>
  );
}

function StarSVG({ size, className }: { size: number; className?: string }) {
  //별 SVG (currentColor 사용)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.25l2.955 5.985 6.6.96-4.777 4.654 1.128 6.58L12 17.77l-5.906 3.659 1.128-6.58L2.445 9.195l6.6-.96L12 2.25z"
      />
    </svg>
  );
}
