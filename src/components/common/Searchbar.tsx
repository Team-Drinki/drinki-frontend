import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import Search from '../svg/Search';

interface SearchbarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function Searchbar({
  className,
  placeholder = '검색어를 입력하세요',
  onSearch,
}: SearchbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    onSearch?.(searchRef.current?.value || '');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={cn(
        'relative h-fit w-full rounded-[100px] bg-transparent shadow-[0_0_7px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      <input
        ref={searchRef}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyPress}
        className="outline-brown w-full rounded-full bg-transparent px-5 py-3 pr-14 text-[1.125rem] font-semibold text-black outline-2 placeholder:text-grey-700 focus:text-grey-900 sm:px-8 sm:py-4 sm:pr-18 sm:text-head5 placeholder:focus:text-gray-900"
      />
      <Search className="absolute right-5 top-1/2 size-6 -translate-y-1/2 transform text-brown sm:right-8 sm:size-8" />
    </div>
  );
}
