'use client';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import IntensityPopover from './IntensityPopover';

type Props = {
  label: string;
  isSelected: boolean;
  intensity: number;
  onSelect: () => void;
  onDeselect: () => void;
  onIntensityChange: (value: number) => void;
};

export default function FlavorItem({
  label,
  isSelected,
  intensity,
  onSelect,
  onDeselect,
  onIntensityChange,
}: Props) {
  // 선택되지 않았을 때의 UI
  if (!isSelected) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center justify-center text-center h-24 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 transition-all hover:border-yellow-300 active:border-yellow-500"
      >
        {label}
      </button>
    );
  }

  // 선택되었을 때의 UI (팝업 기능 포함)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative flex flex-col items-center justify-center h-24 rounded-lg bg-[#FFF8E4] cursor-pointer text-sm text-brown-900 font-semibold p-2 border-2 border-amber-400">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onDeselect();
            }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/20 rounded-full text-white text-xs"
          >
            ×
          </button>
          <span className="text-center">{label}</span>
          <span className="absolute bottom-1 right-2 text-lg font-bold">
            {intensity.toFixed(1)}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="border-none bg-transparent shadow-none w-auto p-0">
        <IntensityPopover
          label={label}
          value={intensity}
          onChange={onIntensityChange}
          step={0.1} // 0.1 단위로 설정
          width={280}
        />
      </PopoverContent>
    </Popover>
  );
}
