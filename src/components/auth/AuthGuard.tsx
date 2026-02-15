'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/hooks/useAuthStatus';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  loadingFallback?: ReactNode;
}

export default function AuthGuard({
  children,
  redirectTo = '/login',
  loadingFallback = null,
}: AuthGuardProps) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, redirectTo, router]);

  if (!isReady) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
