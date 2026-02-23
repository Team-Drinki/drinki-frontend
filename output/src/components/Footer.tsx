'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

export default function Footer() {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <footer className="bg-brown text-white gap-8 py-6 px-12 flex flex-col items-center justify-between">
        <div className="bg-white py-6 px-4">
          <img src="/logo/drinki-logo.png" alt="Drinki 로고" className="w-20" />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex gap-4 text-xs mb-2">
            <Link href="#">개발진</Link>
            <Link href="#">이용약관</Link>
            <Link href="#">개인정보처리방침</Link>
            <Link href="#">고객센터</Link>
          </div>
          <div className="text-xs">
            사업자번호 <span>111-22-33333</span> | 문의{' '}
            <a href="mailto:Drinki@gmail.com" className=" hover:text-yellow-300">
              Drinki@gmail.com
            </a>
          </div>
          <div className="text-sm text-center mt-8">
            경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아
            출생 위험을 높입니다.
          </div>
        </div>
      </footer>
    );
  return (
    <footer className="bg-brown text-white py-12 px-24 flex flex-row items-center justify-between">
      <div className="bg-white py-12 px-8">
        <img src="/logo/drinki-logo.png" alt="Drinki 로고" className="w-36" />
      </div>

      <div className="flex flex-col items-end">
        <div className="flex gap-10 text-head6 mb-2">
          <Link href="#">개발진</Link>
          <Link href="#">이용약관</Link>
          <Link href="#">개인정보처리방침</Link>
          <Link href="#">고객센터</Link>
        </div>
        <div className="text-body2">
          사업자번호 <span>111-22-33333</span> | 문의{' '}
          <a href="mailto:Drinki@gmail.com" className=" hover:text-yellow-300">
            Drinki@gmail.com
          </a>
        </div>
        <div className="mt-16 text-body1 text-right">
          경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생
          위험을 높입니다.
        </div>
      </div>
    </footer>
  );
}
