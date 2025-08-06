import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

interface BackButtonProps {
  className?: string;
  children?: string;
}

export default function BackButton({ className, children }: BackButtonProps) {
  return (
    <div className={cn('flex flex-row items-center h-fit gap-0', className)}>
      <ChevronLeft className="size-9" />
      <span className="text-head5">{children}</span>
    </div>
  );
}
