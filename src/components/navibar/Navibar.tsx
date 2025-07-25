'use client';

import Link from 'next/link';
import MypageIcon from '../svg/mypage-icon';
import { Button } from '../ui/button';
import { DrinkDropdownContent } from './DropDownMenu';
import { drinkCategories } from './const';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <nav className="h-32 sticky top-0 z-50 w-full bg-white">
      <div className="h-full container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex flex-row justify-start items-center min-w-3/5 max-md:w-full">
          <Link href="/">
            <img
              src="/logo/drinki-logo.png"
              alt="Drinki 로고"
              className="w-36 rounded-xl hover:opacity-80 transition max-md:w-20"
            />
          </Link>
          <div className="w-full text-dark-brown text-head6 ml-10 max-md:ml-0 flex flex-row items-center justify-start text-brown-800 font-medium">
            <div
              ref={dropdownRef}
              className="flex-1 relative group flex items-center justify-center"
            >
              <Button
                variant="outline"
                className={cn(
                  isMobile && isDropdownOpen && 'bg-yellow-500',
                  'max-md:text-xs font-semibold border-0 w-full leading-none p-0 h-auto shadow-none text-[1.25rem] hover:bg-yellow-500 rounded-md'
                )}
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                Drink
              </Button>
              <DrinkDropdownContent isOpen={isDropdownOpen} categories={drinkCategories} />
            </div>
            <Link
              href="/tasting-note"
              className="text-center leading-none py-0.5 max-md:text-xs hover:bg-yellow-500 flex-1 rounded-md"
            >
              Tasting Note
            </Link>
            <Link
              href="/community"
              className="leading-none py-0.5 max-md:text-xs text-center hover:bg-yellow-500 flex-1 rounded-md"
            >
              Community
            </Link>
          </div>
        </div>
        <Link href="/login">
          <MypageIcon className={isMobile ? 'size-5' : ''} />
        </Link>
      </div>
    </nav>
  );
}
