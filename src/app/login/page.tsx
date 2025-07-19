'use client';

import CustomButton from '@/components/common/custom-button';
import { SiNaver, SiGoogle } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-head2 text-brown mb-8">Log in</h1>
      <div className="w-full max-w-xs flex flex-col gap-4">
        <CustomButton
          icon={<RiKakaoTalkFill className="text-xl" />}
          className="bg-[#FEE500] text-black hover:bg-[#e5ce00] font-semibold w-full"
        >
          카카오로 로그인
        </CustomButton>

        <CustomButton className="bg-[#03C75A] text-white hover:bg-[#02b24f] font-semibold w-full">
          <SiNaver className="text-xl" />
          네이버 ID로 로그인
        </CustomButton>

        <CustomButton
          icon={<SiGoogle className="text-xl" />}
          className="bg-[#F2F2F2] text-black hover:bg-[#e0e0e0] font-semibold w-full"
        >
          Google 계정으로 로그인
        </CustomButton>
      </div>
    </main>
  );
}
