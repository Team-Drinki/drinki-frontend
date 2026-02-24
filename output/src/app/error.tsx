'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <Image
            src="/images/error.webp"
            alt="Error"
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">오류가 발생했습니다</h1>
          <p className="text-muted-foreground sm:text-lg">
            페이지를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        <Button onClick={reset} variant="default" size="lg" className="mt-4">
          다시 시도
        </Button>
      </div>
    </div>
  );
}
