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
          'cursor-pointer flex items-center py-2 gap-2 w-full rounded-[0.5rem] text-brown bg-white',
          isFirst && 'bg-yellow-main'
        )}
      >
        <span className="text-head4 shrink-0 px-4">{index + 1}</span>
        <p
          className={cn(
            'text-body1 truncate whitespace-nowrap overflow-hidden min-w-0',
            isFirst && 'text-head6'
          )}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}
