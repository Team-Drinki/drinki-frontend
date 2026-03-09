'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Heart from '../svg/Heart';
import Eye from '../svg/Eye';
import Message from '../svg/Message';

interface DrinkCardProps {
  title: string;
  author: string;
  imageUrl: string;
  avatarUrl?: string;
  likes: number;
  views: number;
  comments: number;
}

export default function DrinkCard({
  title,
  author,
  imageUrl,
  avatarUrl,
  likes,
  views,
  comments,
}: DrinkCardProps) {
  return (
    <Card className="flex h-[14rem] w-[10.5rem] flex-col items-start gap-0 overflow-hidden rounded-xl p-0 sm:h-[16rem] sm:w-[14rem] md:h-[18rem] md:w-[20rem]">
      <div className="relative h-[9rem] w-full sm:h-[10.5rem] md:h-[13rem]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 168px, (max-width: 768px) 224px, 320px"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-[0.375rem] bg-yellow-100 px-1.5 py-0.5 text-[11px] sm:px-2 sm:py-1 sm:text-caption">
          <Heart />
          {likes}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-1.5 px-2.5 py-2.5 sm:gap-2 sm:px-3.5 sm:py-3">
        <h3 className="line-clamp-1 text-[1.1rem] leading-[1.25] font-semibold sm:text-head6">{title}</h3>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <span className="max-w-[5rem] truncate text-[12px] sm:max-w-none sm:text-body3">{author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:gap-2 sm:text-caption">
            <div className="flex items-center gap-1">
              <Eye /> {views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Message /> {comments}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
