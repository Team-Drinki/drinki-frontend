'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type FlavorGroupCardProps = {
  label: string;
  info?: string; // i 툴팁 텍스트
  defaultOpen?: boolean; // 기본 펼침 여부
  children: React.ReactNode;
};

export default function FlavorGroupCard({
  label,
  info,
  defaultOpen = false,
  children,
}: FlavorGroupCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={
        // 기본은 흰색, 펼쳐지면 배경/테두리만 바꿈
        `w-full rounded-xl border transition
         bg-white border-brown-200
         data-[state=open]:bg-[#FFF8E4] data-[state=open]:border-brown-300`
      }
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#5F5F3B] text-[15px] text-[#5F5F3B] leading-none">
                  i
                </span>
              </TooltipTrigger>
              {info && (
                <TooltipContent side="top" className="max-w-[260px] text-xs leading-5">
                  {info}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <span className="font-semibold text-brown-900">{label}</span>
        </div>

        {/* 토글 버튼 (▲/▼ 느낌) */}
        <CollapsibleTrigger
          className="group inline-flex items-center gap-1 rounded-md px-2 py-1 text-brown-800 hover:bg-brown-100/60"
          aria-label={open ? '섹션 접기' : '섹션 펼치기'}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
      </div>

      {/* 구분선 */}
      <div className="mx-3 mt-2 border-t border-brown-200" />

      {/* 콘텐츠 (펼쳤을 때만) */}
      <CollapsibleContent className="px-3 pb-3 pt-2 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
