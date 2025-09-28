import React from 'react';
import Image from 'next/image';
import PostActionMenu from '@/components/common/PostActionMenu';

export default function PostTitle({
  id,
  boardType,
  title,
  proileImage,
  authorNickname,
  createdAt,
  views,
}: {
  id: string;
  boardType: string;
  title: string;
  proileImage?: string;
  authorNickname: string;
  createdAt: string;
  views: number;
}) {
  const currentUserId = '1'; // 더보기 메뉴 테스트용 임시 유저 아이디

  return (
    <div className="flex flex-col align-start gap-2.5">
      <h6 className="text-head6 text-sub-1">{boardType}</h6>
      <h3 className="text-head3 text-black">{title}</h3>
      <div className="flex items-center place-content-between">
        <div className="flex items-center gap-2.5">
          <Image
            src={proileImage || '/images/default-profile.png'}
            alt="profile"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-head6 text-black">{authorNickname}</span>
        </div>
        <div>
          <dl className="flex gap-10 items-center text-black">
            <div className="flex gap-2.5 items-center">
              <dt className="text-head6">작성</dt>
              <dd className="text-body2">{createdAt}</dd>
            </div>
            <div className="flex gap-2.5 items-center">
              <dt className="text-head6">조회수</dt>
              <dd className="text-body2">{views}</dd>
            </div>
            <PostActionMenu postId={id} isOwner={id === currentUserId} />
          </dl>
        </div>
      </div>
    </div>
  );
}
