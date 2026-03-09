import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface TitleProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Title({ className, children }: TitleProps) {
  return (
    <div className={cn('flex h-fit flex-row items-center gap-1 md:gap-0', className)}>
      <span className="whitespace-nowrap text-[clamp(1.75rem,7.2vw,2.5rem)] leading-[1.2] font-bold">
        {children}
      </span>
      <ChevronRight className="size-[clamp(1.75rem,6vw,3rem)]" />
    </div>
  );
}
