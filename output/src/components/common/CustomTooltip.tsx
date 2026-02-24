'use client';

import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export type TooltipOption = {
  key?: string;
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
};

type CustomTooltipProps = {
  /** 아이콘/텍스트 등 트리거 UI */
  trigger: React.ReactNode;
  /** 간단한 목록형 옵션들 (label, onSelect) */
  options?: TooltipOption[];
  /** 옵션 대신 완전 커스텀 콘텐츠를 쓰고 싶을 때 */
  content?: React.ReactNode;
  /** Tooltip 위치/간격 */
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  /** 스타일 커스터마이즈 */
  contentClassName?: string;
  /** 옵션 클릭 시 자동 닫기 (기본 true) */
  closeOnSelect?: boolean;
};

export default function CustomTooltip({
  trigger,
  options,
  content,
  side = 'bottom',
  align = 'end',
  sideOffset = 6,
  contentClassName,
  closeOnSelect = true,
}: CustomTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(v => !v);
  const close = () => setOpen(false);

  const handleSelect = (opt: TooltipOption) => {
    if (opt.disabled) return;
    opt.onSelect?.();
    if (closeOnSelect) close();
  };

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggle}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
              }
            }}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            {trigger}
          </button>
        </TooltipTrigger>

        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          onPointerDownOutside={close}
          onEscapeKeyDown={close}
          className={[
            // 기본값(원하면 contentClassName으로 덮어쓰기)
            'bg-grey-100 shadow-[2px_2px_4px_rgba(34,24,20,0.15)]',
            contentClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content ? (
            content
          ) : (
            <ul className="min-h-10 flex items-center divide-x-1 divide-grey-400">
              {options?.map((opt, i) => (
                <li key={opt.key ?? i}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    className={[
                      'text-button text-black px-4.5 hover:bg-muted/50 focus:outline-none',
                      opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      opt.className ?? '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
