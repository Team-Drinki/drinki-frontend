'use client';
import Image from 'next/image';
import Heart from '@/components/svg/Heart';
import CommentActionMenu from './CommentActionMenu';

interface CommentProps {
  commentId: number | string;
  authorId: number;
  nickname: string;
  date: string;
  content: string;
  likes: number;
  avatarUrl?: string;
}

export default function Comment({
  commentId,
  authorId,
  nickname,
  date,
  content,
  likes,
  avatarUrl,
}: CommentProps) {
  const currentUserId = 1; // 현재 로그인한 사용자 id (자신이 작성한 포스트/댓글일 경우 더보기 버튼 툴팁이 바뀜)

  return (
    <div className="flex flex-col gap-2.5 py-6">
      <div className="flex place-content-between">
        <div className="flex items-center gap-2.5">
          {/* 아바타 영역 */}
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${nickname} avatar`}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
              {nickname?.[0] ?? '?'}
            </div>
          )}
          <span className="text-head6 text-black">{nickname}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-caption text-black">{date}</span>
          <CommentActionMenu commentId={commentId} isOwner={authorId == currentUserId} />
        </div>
      </div>
      <span className="text-body1 text-black">{content}</span>
      <div className="flex items-center gap-7.5 text-caption text-sub-1">
        <div className="text-sub-1">답글 쓰기</div>
        <div className="flex gap-0.5 items-center">
          <Heart fill={false} />
          <span className="text-caption text-sub-1">{likes}</span>
        </div>
      </div>
    </div>
  );
}
