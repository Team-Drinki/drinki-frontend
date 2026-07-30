'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

const FOOTER_LINKS = {
  team: 'https://app.notion.com/p/3ad39f121a5c8077a1dbe762194111e6?source=copy_link',
  terms: 'https://app.notion.com/p/3ad39f121a5c80fbbe94d0fa645523f0?source=copy_link',
  privacy: 'https://app.notion.com/p/3ad39f121a5c803681a1c248a3bafafa?source=copy_link',
  operations:
    'https://app.notion.com/p/Team-Drinki-83f39f121a5c829a83b701fb9839fc10?source=copy_link',
} as const;

interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact = false }: FooterProps) {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <footer
        className={`flex flex-col items-center justify-between px-4 text-black ${
          compact ? 'gap-3 py-4' : 'gap-6 py-6'
        }`}
        style={{ backgroundColor: '#E6D3C2' }}
      >
        <Link
          href="/"
          aria-label="홈으로 이동"
          className={compact ? 'px-2' : 'px-2 py-2'}
          style={{ backgroundColor: '#E6D3C2' }}
        >
          <img
            src="/logo/drinki-logo.png"
            alt="Drinki 로고"
            className={compact ? 'w-16' : 'w-20'}
          />
        </Link>

        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            <Link href={FOOTER_LINKS.team} target="_blank" rel="noopener noreferrer">
              개발진
            </Link>
            <Link href={FOOTER_LINKS.terms} target="_blank" rel="noopener noreferrer">
              이용약관
            </Link>
            <Link href={FOOTER_LINKS.privacy} target="_blank" rel="noopener noreferrer">
              개인정보처리방침
            </Link>
            <button type="button" onClick={() => window.alert('준비중입니다.')}>
              고객센터
            </button>
          </div>
          <div className="text-center text-xs">
            운영팀{' '}
            <Link
              href={FOOTER_LINKS.operations}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-yellow-300 focus-visible:text-yellow-300"
            >
              <span>Team. Drinki</span>
            </Link>
            <br />
            문의{' '}
            <a href="mailto:official.drinki@gmail.com" className=" hover:text-yellow-300">
              official.drinki@gmail.com
            </a>
          </div>
          <div className={`${compact ? 'mt-2' : 'mt-5'} text-center text-xs`}>
            경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아
            출생 위험을 높입니다.
          </div>
        </div>
      </footer>
    );
  return (
    <footer
      className={`flex flex-row items-center justify-between text-black ${
        compact ? 'px-12 py-5' : 'px-24 py-12'
      }`}
      style={{ backgroundColor: '#E6D3C2' }}
    >
      <Link
        href="/"
        aria-label="홈으로 이동"
        className={compact ? 'px-4 py-2' : 'px-8 py-12'}
        style={{ backgroundColor: '#E6D3C2' }}
      >
        <img src="/logo/drinki-logo.png" alt="Drinki 로고" className={compact ? 'w-24' : 'w-36'} />
      </Link>

      <div className="flex flex-col items-end">
        <div className={`flex ${compact ? 'mb-1 gap-6 text-sm' : 'mb-2 gap-10 text-head6'}`}>
          <Link href={FOOTER_LINKS.team} target="_blank" rel="noopener noreferrer">
            개발진
          </Link>
          <Link href={FOOTER_LINKS.terms} target="_blank" rel="noopener noreferrer">
            이용약관
          </Link>
          <Link href={FOOTER_LINKS.privacy} target="_blank" rel="noopener noreferrer">
            개인정보처리방침
          </Link>
          <button type="button" onClick={() => window.alert('준비중입니다.')}>
            고객센터
          </button>
        </div>
        <div className={compact ? 'text-xs' : 'text-body2'}>
          운영팀{' '}
          <Link
            href={FOOTER_LINKS.operations}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-yellow-300 focus-visible:text-yellow-300"
          >
            <span>Team. Drinki</span>
          </Link>{' '}
          | 문의{' '}
          <a href="mailto:official.drinki@gmail.com" className=" hover:text-yellow-300">
            official.drinki@gmail.com
          </a>
        </div>
        <div className={`${compact ? 'mt-3 text-xs' : 'mt-16 text-body1'} text-right`}>
          경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생
          위험을 높입니다.
        </div>
      </div>
    </footer>
  );
}
