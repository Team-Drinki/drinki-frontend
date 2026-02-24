'use client';
import Image from 'next/image';
import Heart from '@/components/svg/Heart';
import CommentActionMenu from './CommentActionMenu';
import clsx from 'clsx';
import { useReplyComposer } from './ReplyComposerContext';

interface CommentProps {
  commentId: number | string;
  authorId: number;
  nickname: string;
  date: string;
  content: string;
  likes: number;
  avatarUrl?: string;
  depth?: number; // 대댓글의 깊이 (기본값 0)
}

export default function Comment({
  commentId,
  authorId,
  nickname,
  date,
  content,
  likes,
  avatarUrl,
  depth = 0,
}: CommentProps) {
  const currentUserId = 1; // 현재 로그인한 사용자 id (자신이 작성한 포스트/댓글일 경우 더보기 버튼 툴팁이 바뀜)

  const { openFor } = useReplyComposer();

  return (
    <div className={clsx('flex py-6 gap-4.5', depth > 0 && 'border-t-1 border-grey-400')}>
      {/* 대댓글 기호 */}
      {depth > 0 && (
        <div className="pl-3 ">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1V13C1 17.4183 4.58172 21 9 21H21"
              stroke="#BEBEBA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 ">
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
                {nickname?.[0] ?? ''}
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
          {depth === 0 && (
            <div className="text-sub-1" onClick={() => openFor(String(commentId))}>
              답글쓰기
            </div>
          )}
          <div className="flex gap-0.5 items-center">
            <Heart fill={false} />
            <span className="text-caption text-sub-1">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
