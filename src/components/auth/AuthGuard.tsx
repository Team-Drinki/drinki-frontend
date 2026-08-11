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
  const { isReady, isAuthenticated, isError, refetch } = useAuthStatus();

  useEffect(() => {
    if (isReady && !isError && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, isError, redirectTo, router]);

  if (!isReady) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">로그인 상태를 확인하지 못했어요.</p>
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

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
