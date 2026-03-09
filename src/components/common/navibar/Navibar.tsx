'use client';

import Link from 'next/link';
import { Button } from '../../ui/button';
import { drinkCategories } from './const';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DrinkDropdownContent } from '@/components/common/navibar/DropDownMenu';
import MypageIcon from '../../svg/MypageIcon';

export function Navibar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="sticky top-0 z-50 h-20 w-full bg-white md:h-32">
      <div className="container mx-auto flex h-full items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 flex-1 flex-row items-center justify-start">
          <Link href="/">
            <img
              src="/logo/drinki-logo.png"
              alt="Drinki 로고"
              className="w-22 rounded-xl transition hover:opacity-80 md:w-36"
            />
          </Link>
          <div className="ml-3 flex w-full min-w-0 flex-row items-center justify-start text-brown-800 md:ml-10">
            <div
              ref={dropdownRef}
              className="group relative flex flex-1 items-center justify-center"
            >
              <Button
                variant="outline"
                className={cn(
                  isMobile && isDropdownOpen && 'bg-yellow-500',
                  'h-auto w-full rounded-md border-0 p-0 text-[13px] leading-none font-semibold shadow-none hover:bg-yellow-500 md:text-[1.25rem]'
                )}
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                Drink
              </Button>
              <DrinkDropdownContent isOpen={isDropdownOpen} categories={drinkCategories} />
            </div>
            <Link
              href="/tasting-note"
              className="flex-1 rounded-md py-0.5 text-center text-[13px] leading-none font-semibold hover:bg-yellow-500 md:text-[1.25rem]"
            >
              Tasting Note
            </Link>
            <Link
              href="/community"
              className="flex-1 rounded-md py-0.5 text-center text-[13px] leading-none font-semibold hover:bg-yellow-500 md:text-[1.25rem]"
            >
              Community
            </Link>
          </div>
        </div>
        <Link href="/mypage" className="ml-3 shrink-0">
          <MypageIcon className={isMobile ? 'size-4.5' : 'size-6'} />
        </Link>
      </div>
    </nav>
  );
}
