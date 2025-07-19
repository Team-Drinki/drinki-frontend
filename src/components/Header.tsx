'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { UserIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="h-32 sticky top-0 z-50 w-full bg-white shadow">
      <div className="h-full container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/">
          <img
            src="/logo/drinki-logo.png"
            alt="Drinki 로고"
            className="w-32 rounded-xl hover:opacity-80 transition"
          />
        </Link>
        <nav className="text-dark-brown text-head6 ml-32 flex flex-row gap-24 w-full items-center justify-start text-brown-800 font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger>Drink</DropdownMenuTrigger>
            <DropdownMenuContent className="grid grid-cols-3 gap-4 p-6 bg-yellow-50 rounded-md shadow-xl text-sm">
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">위스키</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="#">싱글몰트</Link>
                  </li>
                  <li>
                    <Link href="#">블렌디드</Link>
                  </li>
                  <li>
                    <Link href="#">버번</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">와인</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="#">레드</Link>
                  </li>
                  <li>
                    <Link href="#">화이트</Link>
                  </li>
                  <li>
                    <Link href="#">스파클링</Link>
                  </li>
                  <li>
                    <Link href="#">로제</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">기타</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="#">사케</Link>
                  </li>
                  <li>
                    <Link href="#">중국술</Link>
                  </li>
                  <li>
                    <Link href="#">전통주</Link>
                  </li>
                </ul>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/tasting-note" className="hover:bg-yellow-500 px-12 rounded-md">
            Tasting Note
          </Link>
          <Link href="/community" className="hover:bg-yellow-500 px-12 rounded-md">
            Community
          </Link>
        </nav>
        <Link href="/login">
          <UserIcon className="w-6 h-6 text-brown-800" />
        </Link>
      </div>
    </header>
  );
}
