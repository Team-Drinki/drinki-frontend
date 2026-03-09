'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

export default function Footer() {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <footer
        className="flex flex-col items-center justify-between gap-6 px-4 py-6 text-black"
        style={{ backgroundColor: '#E6D3C2' }}
      >
        <div className="px-2 py-2" style={{ backgroundColor: '#E6D3C2' }}>
          <img src="/logo/drinki-logo.png" alt="Drinki 로고" className="w-20" />
        </div>

        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            <Link href="#">개발진</Link>
            <Link href="#">이용약관</Link>
            <Link href="#">개인정보처리방침</Link>
            <Link href="#">고객센터</Link>
          </div>
          <div className="text-center text-xs">
            사업자번호 <span>111-22-33333</span>
            <br />
            문의{' '}
            <a href="mailto:Drinki@gmail.com" className=" hover:text-yellow-300">
              Drinki@gmail.com
            </a>
          </div>
          <div className="mt-5 text-center text-xs">
            경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아
            출생 위험을 높입니다.
          </div>
        </div>
      </footer>
    );
  return (
    <footer
      className="flex flex-row items-center justify-between px-24 py-12 text-black"
      style={{ backgroundColor: '#E6D3C2' }}
    >
      <div className="py-12 px-8" style={{ backgroundColor: '#E6D3C2' }}>
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
