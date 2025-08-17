'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';

export default function TastingNotePage() {
  return (
    <div className="flex-1">
      <div className="container mx-auto px-6 py-8">
        {/* 새글쓰기 버튼 */}
        <div className="flex justify-end mb-6">
          <Link href="/tasting-note/write">
            {/* 임시 버튼, 필요시 삭제 */}
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-brown-800 font-medium">
              <Pen className="w-4 h-4 mr-2" />
              새글쓰기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
