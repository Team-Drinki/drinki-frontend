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
    <Card className="w-[24rem] h-[18rem] flex flex-col items-start rounded-xl overflow-hidden gap-0 p-0">
      <div className="relative w-full h-[13rem]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 384px"
        />
        <div className="absolute text-caption top-2.5 right-2.5 bg-yellow-100 px-2 py-1 rounded-[0.375rem] flex items-center gap-1">
          <Heart />
          {likes}
        </div>
      </div>
      <div className="w-full px-4.5 py-3.5 flex flex-col gap-2 items-start justify-center">
        <h3 className="text-head6">{title}</h3>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <span className="text-body3">{author}</span>
          </div>
          <div className="flex items-center gap-2 text-caption">
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
