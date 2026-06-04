'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BackButton from '@/components/common/BackButton';
import CommentSection from '@/components/comment/CommentSection';
import PostActionMenu from '@/components/common/PostActionMenu';
import { getPostById, togglePostLike } from '@/api/posts';
import { authQueryOptions } from '@/query/options/auth';

function formatShortDate(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

function categoryLabel(category?: string) {
  if (category === 'QUESTION') return '질문';
  if (category === 'FREE') return '자유';
  return category ?? '-';
}

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const queryClient = useQueryClient();
  const { data: currentUserId } = useQuery(authQueryOptions);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['community', 'post', postId],
    queryFn: () => getPostById(postId ?? ''),
    enabled: Boolean(postId),
    retry: false,
    throwOnError: false,
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setIsLiked(data?.isLiked ?? false);
    setLikeCount(data?.likeCnt ?? 0);
  }, [data?.isLiked, data?.likeCnt]);

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(postId ?? ''),
    onSuccess: async result => {
      setIsLiked(result.isLiked);
      await queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      await queryClient.invalidateQueries({ queryKey: ['community', 'post', postId] });
    },
    onError: () => {
      setIsLiked(data?.isLiked ?? false);
      setLikeCount(data?.likeCnt ?? 0);
    },
  });

  const handleToggleLike = () => {
    if (!postId || likeMutation.isPending) {
      return;
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount(count => (nextLiked ? count + 1 : Math.max(0, count - 1)));
    likeMutation.mutate();
  };

  if (isLoading) {
    return <main className="mx-auto max-w-[1120px] px-5 py-10 text-grey-700">불러오는 중...</main>;
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-[1120px] px-5 py-10 text-grey-700">
        게시글을 불러오지 못했습니다.
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center gap-10 mx-31">
      <BackButton>Community</BackButton>
      <section className="flex flex-col">
        <div className="flex flex-col align-start gap-2.5 mx-4 mb-10">
          <h6 className="text-head6 text-sub-1">{categoryLabel(data.category)}</h6>
          <h3 className="text-head3 text-black">{data.title}</h3>
          <div className="flex items-center place-content-between">
            <div className="flex items-center gap-2.5">
              <Image
                src={data.author.profileImageUrl ?? '/images/avatar.png'}
                alt="profile"
                width={50}
                height={50}
                unoptimized={Boolean(data.author.profileImageUrl?.startsWith('http'))}
                className="rounded-full"
              />
              <span className="text-head6 text-black">{data.author.nickname}</span>
            </div>
            <div>
              <dl className="flex gap-10 items-center text-black">
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">작성</dt>
                  <dd className="text-body2">{formatShortDate(data.createdAt)}</dd>
                </div>
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">조회수</dt>
                  <dd className="text-body2">{data.viewCnt}</dd>
                </div>
                <PostActionMenu postId={postId} isOwner={currentUserId === data.userId} />
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div className="aspect-[4/3] relative max-h-[40vh]">
            <Image
              src={data.imageUrl ?? '/images/communityimg.png'}
              alt="community"
              fill
              unoptimized={Boolean(data.imageUrl?.startsWith('http'))}
              className="object-contain object-left"
            />
          </div>
          <span className="text-body1 text-black whitespace-pre-wrap">{data.body}</span>
        </div>
        <CommentSection
          postId={postId}
          likeCount={likeCount}
          commentCount={data.commentCnt}
          isLiked={isLiked}
          isLikePending={likeMutation.isPending}
          onToggleLike={handleToggleLike}
        />
      </section>
    </main>
  );
}
