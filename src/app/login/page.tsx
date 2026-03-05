import GoogleLogo from '@/components/svg/GoogleLogo';

export default function LoginPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const googleLoginUrl = `${apiBaseUrl}/api/v1/auth/login/google`;

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white mb-20">
      <h1 className="text-head2 text-dark-brown mb-12">Log in</h1>
      <div className="w-full max-w-xs flex flex-col gap-5">
        <a
          href={googleLoginUrl}
          className="relative flex justify-center items-center w-80 h-10 rounded-lg font-semibold bg-[#F2F2F2] hover:bg-[#e0e0e0]"
        >
          <span className="absolute left-3">
            <GoogleLogo className="size-4.5" />
          </span>
          <span className="font-semibold text-sm text-black">Google 계정으로 로그인</span>
        </a>
      </div>
    </main>
  );
}
