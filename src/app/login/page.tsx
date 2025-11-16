'use client';

import { Suspense } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GoogleLogo from '@/components/svg/GoogleLogo';
import LoginButton from '@/components/buttons/LoginButton';
import { Button } from '@/components/ui/button';
import { loginWithGoogle, logout } from '@/api/auth';
import { authQueryOptions } from '@/query/options/auth';

function LoginContent() {
  const { data: userId } = useSuspenseQuery(authQueryOptions);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
  });

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = userId !== null && userId !== undefined;

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white mb-20">
      <h1 className="text-head2 text-dark-brown mb-12">{isAuthenticated ? '' : 'Log in'}</h1>
      <div className="w-full max-w-xs flex flex-col gap-5">
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            variant="default"
            size="lg"
            className="bg-yellow-main text-black hover:bg-yellow-main/80 cursor-pointer"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
          </Button>
        ) : (
          <>
            {/* 추후 확장 */}
            {/* <LoginButton
              className="bg-[#FEE500] text-black hover:bg-[#e5ce00] font-semibold"
              icon={<KakaoLogo className="size-[1.1rem]" />}
            >
              <p className="font-semibold text-sm">카카오로 로그인</p>
            </LoginButton>
            <LoginButton
              className="bg-[#03C75A] text-white hover:bg-[#02b24f] font-semibold"
              icon={<SiNaver className="size-3.5 ml-0.5" />}
            >
              <p className="font-semibold text-sm">네이버 ID로 로그인</p>
            </LoginButton> */}
            <LoginButton
              className="bg-[#F2F2F2] hover:bg-[#e0e0e0]"
              onClick={handleGoogleLogin}
              icon={<GoogleLogo className="size-4.5" />}
            >
              <p className="font-semibold text-sm text-black">Google 계정으로 로그인</p>
            </LoginButton>
          </>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex flex-col items-center justify-center bg-white mb-20">
          <p className="text-muted-foreground">로딩 중...</p>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
