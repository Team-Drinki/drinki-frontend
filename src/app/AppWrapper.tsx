'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { Navibar } from '@/components/common/navibar/Navibar';
import { ReactNode } from 'react';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideFooterRoutes = ['/login'];

  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <>
      <Navibar />
      {children}
      {showFooter && <Footer />}
    </>
  );
}
