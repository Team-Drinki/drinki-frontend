import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface TitleProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Title({ className, children }: TitleProps) {
  return (
    <div className={cn('flex flex-row items-center h-fit gap-0', className)}>
      <span className="text-head3">{children}</span>
      <ChevronRight className="size-12" />
    </div>
  );
}
