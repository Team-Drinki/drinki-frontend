import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HotCommunityPostCardProps {
  index: number;
  title: string;
  href: string;
}

export function HotCommunityPostCard({ index, title, href }: HotCommunityPostCardProps) {
  const isFirst = index === 0;

  return (
    <Link href={href} className="block w-full">
      <div
        className={cn(
          'cursor-pointer flex w-full items-center gap-2 rounded-[0.5rem] bg-white py-1.5 text-brown md:py-2',
          isFirst && 'bg-yellow-main'
        )}
      >
        <span className="shrink-0 px-3 text-[1.35rem] leading-none font-bold md:px-4 md:text-head4">
          {index + 1}
        </span>
        <p
          className={cn(
            'min-w-0 truncate whitespace-nowrap overflow-hidden text-[0.92rem] leading-6 md:text-body1',
            isFirst && 'font-semibold md:text-head6'
          )}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}
