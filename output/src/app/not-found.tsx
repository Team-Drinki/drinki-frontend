'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <Image
            src="/images/error.webp"
            alt="Not Found"
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground sm:text-lg">
            요청하신 페이지가 존재하지 않습니다.
            <br />
            URL을 확인해주세요.
          </p>
        </div>
        <Link href="/">
          <Button variant="default" size="lg" className="mt-4">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
