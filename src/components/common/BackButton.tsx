'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  children?: string;
}

export default function BackButton({ className, children }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      className={cn('flex flex-row items-center h-fit gap-0', className)}
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-9" />
      <span className="text-head5">{children}</span>
    </button>
  );
}
