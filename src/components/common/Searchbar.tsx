import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
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
        'rounded-[100px] relative h-fit w-fit shadow-[0_0_7px_rgba(0,0,0,0.1)] bg-transparent',
        className
      )}
    >
      <input
        ref={searchRef}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyPress}
        className="outline-brown max-lg:w-full outline-2 rounded-full w-[726px] px-10 py-4 text-head5 bg-transparent text-black placeholder:text-gray-700 focus:text-Dark-Gray placeholder:focus:text-gray-900"
      />
      <Search className="absolute size-8 text-brown right-[40px] top-1/2 transform -translate-y-1/2" />
    </div>
  );
}
