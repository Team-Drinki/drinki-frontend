import React from 'react';
import SvgWrapper from './SvgWrapper';

export default function MypageIcon({ className = '' }: { className?: string }) {
  return (
    <SvgWrapper className={className}>
      <path
        d="M2 21.2308C2 16.1328 6.13276 12 11.2308 12H12.7692C17.8672 12 22 16.1328 22 21.2308C22 21.6556 21.6556 22 21.2308 22H2.76923C2.3444 22 2 21.6556 2 21.2308Z"
        fill="#653205"
      />
      <circle cx="12" cy="7" r="4" fill="#653205" />
    </SvgWrapper>
  );
}
