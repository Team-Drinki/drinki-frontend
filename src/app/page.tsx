'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasVerifiedAge, saveAgeVerification } from '@/lib/age-verification';
import { useAuthStatus } from '@/hooks/useAuthStatus';

function isValidAdultBirthDate(year: string, month: string, day: string): boolean {
  if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day)) {
    return false;
  }

  const birthYear = Number(year);
  const birthMonth = Number(month);
  const birthDay = Number(day);
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  const isValidDate =
    birthDate.getFullYear() === birthYear &&
    birthDate.getMonth() === birthMonth - 1 &&
    birthDate.getDate() === birthDay;

  if (!isValidDate) {
    return false;
  }

  const today = new Date();
  const adultThreshold = new Date(today.getFullYear() - 19, today.getMonth(), today.getDate());

  return birthDate <= adultThreshold;
}

export default function AgeVerificationPage() {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthStatus();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (isAuthenticated) {
      saveAgeVerification();
      router.replace('/home');
      return;
    }

    if (hasVerifiedAge()) {
      router.replace('/home');
      return;
    }

    setShouldShow(true);
  }, [isAuthenticated, isAuthReady, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidAdultBirthDate(year, month, day)) {
      setError('만 19세 이상만 이용할 수 있습니다. 생년월일을 다시 확인해주세요.');
      return;
    }

    saveAgeVerification();
    router.replace('/home');
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-grey-100 px-5 py-12 sm:px-8">
      <section className="w-full px-1 text-center sm:px-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-brown">DRINKI</p>
        <h1 className="mt-5 text-2xl font-bold text-black sm:text-3xl">생년월일을 입력해주세요</h1>
        <p className="mt-3 text-sm text-grey-700 sm:text-base">
          만 19세 이상만 이용할 수 있는 주류 정보 서비스입니다.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-[680px]" noValidate>
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-3 sm:gap-6">
            <label className="sr-only" htmlFor="birth-year">
              출생 연도
            </label>
            <input
              id="birth-year"
              type="text"
              inputMode="numeric"
              autoComplete="bday-year"
              maxLength={4}
              value={year}
              onChange={event => setYear(event.target.value.replace(/\D/g, ''))}
              placeholder="YYYY"
              className="min-w-0 border-b-2 border-grey-400 bg-transparent pb-3 text-center text-[clamp(2rem,8vw,4.5rem)] font-semibold tracking-tight text-black outline-none placeholder:text-grey-500 focus:border-yellow-main"
            />
            <label className="sr-only" htmlFor="birth-month">
              출생 월
            </label>
            <input
              id="birth-month"
              type="text"
              inputMode="numeric"
              autoComplete="bday-month"
              maxLength={2}
              value={month}
              onChange={event => setMonth(event.target.value.replace(/\D/g, ''))}
              placeholder="MM"
              className="min-w-0 border-b-2 border-grey-400 bg-transparent pb-3 text-center text-[clamp(2rem,8vw,4.5rem)] font-semibold tracking-tight text-black outline-none placeholder:text-grey-500 focus:border-yellow-main"
            />
            <label className="sr-only" htmlFor="birth-day">
              출생 일
            </label>
            <input
              id="birth-day"
              type="text"
              inputMode="numeric"
              autoComplete="bday-day"
              maxLength={2}
              value={day}
              onChange={event => setDay(event.target.value.replace(/\D/g, ''))}
              placeholder="DD"
              className="min-w-0 border-b-2 border-grey-400 bg-transparent pb-3 text-center text-[clamp(2rem,8vw,4.5rem)] font-semibold tracking-tight text-black outline-none placeholder:text-grey-500 focus:border-yellow-main"
            />
          </div>

          <p aria-live="polite" className="mt-5 min-h-6 text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            type="submit"
            className="mt-5 min-w-32 rounded-lg bg-yellow-main px-10 py-3 font-semibold text-brown transition hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-main"
          >
            확인
          </button>
        </form>
      </section>
    </main>
  );
}
