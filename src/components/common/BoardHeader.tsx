import React from 'react';

export default function BoardHeader() {
  return (
    <header className="bg-yellow-100 px-5 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-14 lg:px-20">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-[clamp(2rem,7vw,3rem)] font-bold text-black">community</h1>
        <h2 className="mt-2 text-body2 text-black sm:text-body1">
          사람들과 자유롭게 의견을 나눠보세요.
        </h2>
      </div>
    </header>
  );
}
