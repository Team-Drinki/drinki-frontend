'use client';

import Image from 'next/image';
import IntensityPopover from './IntensityPopover';

type Props = {
  label: string;
  iconSrc?: string;
  iconActiveSrc?: string;
  isSelected: boolean;
  intensity: number; // 0~5
  onSelect: () => void;
  onDeselect: () => void;
  onIntensityChange: (value: number) => void;
  className?: string;
};

export default function FlavorItem({
  label,
  iconSrc,
  iconActiveSrc,
  isSelected,
  intensity,
  onSelect,
  onDeselect,
  onIntensityChange,
  className,
}: Props) {
  const src = isSelected ? (iconActiveSrc ?? iconSrc) : iconSrc;

  const handleClick = () => (isSelected ? onDeselect() : onSelect());

  const Tile = (
    <div className={['relative flex flex-col items-center', className ?? ''].join(' ')}>
      {/* 아이콘 박스: 이미지가 바닥층 그 위에 X button & intensity 표시*/}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className={[
          'relative h-24 w-28 overflow-hidden rounded-xl border bg-white transition',
          isSelected
            ? 'border-[#402002] ring-2 ring-amber-400'
            : 'border-brown-200 hover:border-amber-400',
        ].join(' ')}
      >
        {/* 바닥층 이미지 (fill) */}
        {src && (
          <Image
            src={src}
            alt={label}
            fill
            sizes="112px"
            priority={false}
            className="object-contain pointer-events-none" // 클릭은 상위 div가 받음
            style={{ transform: 'scale(1.09)' }}
          />
        )}

        {/* 오버레이: 강도 배지 + X 버튼 */}
        {isSelected && (
          <>
            <span
              className="absolute bottom-1 right-2 z-10 rounded-md bg-white/95 px-1.5 text-[10px] font-semibold shadow-sm"
              aria-hidden
            >
              {intensity.toFixed(1)}
            </span>
            <button
              type="button"
              className="absolute right-1 top-1 z-10 rounded-full bg-white/90 px-1 text-[10px] shadow"
              onClick={e => {
                e.stopPropagation();
                onDeselect();
              }}
              aria-label={`${label} 제거`}
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* 라벨: 박스 아래 */}
      <div className="mt-2 text-xs text-brown-800">{label}</div>
    </div>
  );

  return (
    <IntensityPopover
      label={`${label} 강도 조절`}
      value={intensity}
      onChange={v => onIntensityChange(Math.max(0, Math.min(5, v)))}
      width={260}
      asChild
    >
      {Tile}
    </IntensityPopover>
  );
}
