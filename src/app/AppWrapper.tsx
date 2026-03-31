'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { Navibar } from '@/components/common/navibar/Navibar';
import { ReactNode } from 'react';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideFooterRoutes = ['/login', '/tasting-note/write'];

  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <Navibar />
      <div className="flex flex-1 flex-col">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
