'use client';

import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  asChild?: boolean;
  children?: React.ReactNode;
  width?: number;
};

export default function IntensityPopover({
  label,
  value,
  onChange,
  min = 0,
  max = 5,
  step = 0.1,
  asChild = false,
  children,
  width = 200,
}: Props) {
  const [open, setOpen] = React.useState(false);

  /* pop은 slider 부분 밑에 사각형을 어울리게 배치해서 말풍선 모양 만듦 */
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {asChild && children ? (
          children
        ) : (
          <button
            type="button"
            className="h-7 w-7 rounded-md text-[#653205] focus:outline-none"
            aria-label={label}
          >
            ▼
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        className="
          group/pc relative z-50 overflow-visible
          rounded-[20px] border-[2px] border-[#653205] bg-white p-2
          shadow-none outline-none
       "
        style={{ width, height: 45 }}
      >
        <div className="flex items-center gap-4">
          <Slider
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={arr => onChange(arr[0] ?? min)}
            className="
            w-full
            /* 트랙 배경 */
            [&_[data-slot=slider-track]]:!bg-[#DADAD7]
            [&_[data-slot=slider-track]]:h-[5px]
            [&_[data-slot=slider-track]]:rounded-[4px]

            /* 채워지는 부분(갈색) */
            [&_[data-slot=slider-range]]:!bg-[#653205]
            [&_[data-slot=slider-range]]:h-[5px]
            [&_[data-slot=slider-range]]:rounded-[4px]

            /* 썸(갈색) */
            [&_[data-slot=slider-thumb]]:!bg-[#653205]
            [&_[data-slot=slider-thumb]]:h-[16px]
            [&_[data-slot=slider-thumb]]:w-[16px]
            [&_[data-slot=slider-thumb]]:rounded-full
            [&_[data-slot=slider-thumb]]:border-0
            [&_[data-slot=slider-thumb]]:shadow-none
          "
          />
          <div className="w-[30px] text-right font-semibold text-[20px] leading-[120%] text-[#0C0C0C]">
            {value.toFixed(1)}
          </div>
        </div>
        {/* 사각형 */}
        <span
          aria-hidden
          className="
            pointer-events-none absolute left-1/2 -translate-x-1/2
            group-data-[side=top]/pc:-bottom-[8px]
            h-[14px] w-[14px] rotate-45 bg-white
            border-b-[2px] border-r-[2px] border-[#653205]
            rounded-[1px]
          "
        />
      </PopoverContent>
    </Popover>
  );
}
