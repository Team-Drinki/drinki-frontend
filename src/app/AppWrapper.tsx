'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Navibar } from '@/components/common/navibar/Navibar';
import { ReactNode } from 'react';
import { hasVerifiedAge } from '@/lib/age-verification';
import { useAuthStatus } from '@/hooks/useAuthStatus';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAgeVerificationRoute = pathname === '/';
  const { isReady, isAuthenticated, isError, refetch } = useAuthStatus();
  const [canAccess, setCanAccess] = useState(false);

  const hideFooterRoutes = ['/', '/login', '/tasting-note/write'];

  const showFooter = !hideFooterRoutes.includes(pathname);

  useEffect(() => {
    if (!isReady || isError) {
      return;
    }

    if (isAgeVerificationRoute) {
      if (isAuthenticated) {
        setCanAccess(false);
        router.replace('/home');
      } else {
        setCanAccess(true);
      }

      return;
    }

    const canEnter = hasVerifiedAge() || isAuthenticated;
    setCanAccess(canEnter);

    if (!canEnter) {
      router.replace('/');
    }
  }, [isReady, isAuthenticated, isError, isAgeVerificationRoute, pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <p className="text-sm text-muted-foreground">사용자 정보를 확인하고 있어요.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">사용자 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          className="rounded-md bg-brown-700 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <p className="text-sm text-muted-foreground">페이지로 이동하고 있어요.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isAgeVerificationRoute && <Navibar />}
      <div className="flex flex-1 flex-col">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
