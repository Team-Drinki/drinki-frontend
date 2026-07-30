'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Navibar } from '@/components/common/navibar/Navibar';
import { ReactNode } from 'react';
import { hasVerifiedAge } from '@/lib/age-verification';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAgeVerificationRoute = pathname === '/';
  const [canAccess, setCanAccess] = useState(isAgeVerificationRoute);

  const hideFooterRoutes = ['/', '/login', '/tasting-note/write'];

  const showFooter = !hideFooterRoutes.includes(pathname);

  useEffect(() => {
    if (isAgeVerificationRoute) {
      setCanAccess(true);
      return;
    }

    const canEnter = hasVerifiedAge();
    setCanAccess(canEnter);

    if (!canEnter) {
      router.replace('/');
    }
  }, [isAgeVerificationRoute, pathname, router]);

  if (!canAccess) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isAgeVerificationRoute && <Navibar />}
      <div className="flex flex-1 flex-col">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
