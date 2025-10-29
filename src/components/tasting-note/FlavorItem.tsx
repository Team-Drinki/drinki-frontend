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

  // 클릭 시 선택/해제
  const handleClick = () => (isSelected ? onDeselect() : onSelect());

  // 상단: 아이콘 박스 / 하단: 라벨
  const Tile = (
    <div className={['relative flex flex-col items-center', className ?? ''].join(' ')}>
      {/* 아이콘 박스 */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className={[
          'relative flex h-24 w-28 items-center justify-center rounded-xl border bg-white transition',
          isSelected
            ? 'border-[#402002] ring-2 ring-amber-400'
            : 'border-brown-200 hover:border-amber-400',
        ].join(' ')}
      >
        {src && (
          <Image
            src={src}
            alt={label}
            width={48}
            height={48}
            draggable={false}
            className="object-contain"
          />
        )}

        {/* 선택 시 우하단 강도 배지 + 우상단 삭제 버튼 */}
        {isSelected && (
          <>
            <span className="absolute bottom-1 right-2 rounded-md bg-white/95 px-1.5 text-[10px] font-semibold shadow-sm">
              {intensity.toFixed(1)}
            </span>
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-white/90 px-1 text-[10px] shadow"
              onClick={e => {
                e.stopPropagation();
                onDeselect();
              }}
              aria-label="remove"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* 라벨 (박스 아래) */}
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
