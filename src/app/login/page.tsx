'use client';

import { SiNaver } from 'react-icons/si';
import LoginButton from '@/components/buttons/login-button';
import GoogleLogo from '@/components/svg/google-logo';
import KakaoLogo from '@/components/svg/kakao-logo';

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white mb-20">
      <h1 className="text-head2 text-dark-brown mb-12">Log in</h1>
      <div className="w-full max-w-xs flex flex-col gap-5">
        <LoginButton
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
        </LoginButton>
        <LoginButton
          className="bg-[#F2F2F2] hover:bg-[#e0e0e0]"
          icon={<GoogleLogo className="size-4.5" />}
        >
          <p className="font-semibold text-sm text-black">Google 계정으로 로그인</p>
        </LoginButton>
      </div>
    </main>
  );
}
