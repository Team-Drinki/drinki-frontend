'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

type DrinkCategory = {
  category: string;
  subCategory: string[];
};

type DrinkDropdownContentProps = {
  categories: DrinkCategory[];
  isOpen: boolean;
};

export function DrinkDropdownContent({ categories, isOpen }: DrinkDropdownContentProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } w-max min-w-40 absolute top-full left-0 text-sm z-50`}
      >
        <div className="h-2" />
        <div className="grid grid-cols-3 gap-4 px-10 py-3 text-center items-start bg-yellow-100 rounded-md">
          {categories.map(cat => (
            <div key={cat.category} className="flex flex-col items-center gap-4">
              <h4 className="font-semibold text-dark-brown text-head7">{cat.category}</h4>
              <ul className="space-y-2">
                {cat.subCategory.map(item => (
                  <li key={item}>
                    <Link href="#" className="hover:text-grey-500 text-body3 text-black">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="hidden w-max min-w-96 absolute top-full left-0 group-hover:block text-sm z-50">
      <div className="h-2" />
      <div className="grid grid-cols-3 gap-32 px-20 py-6 text-center items-start bg-yellow-100 rounded-md">
        {categories.map(cat => (
          <div key={cat.category} className="flex flex-col items-center gap-4">
            <h4 className="font-semibold text-dark-brown text-head6">{cat.category}</h4>
            <ul className="space-y-2">
              {cat.subCategory.map(item => (
                <li key={item}>
                  <Link href="#" className="hover:text-grey-500 text-body3 text-black">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
