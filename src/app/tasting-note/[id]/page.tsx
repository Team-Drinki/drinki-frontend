'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import BackButton from '@/components/common/BackButton';
import ImageGallery from '@/components/ImageGallery';
import FlavorTile from '@/components/tasting-note/FlavorTile';
import { authQueryOptions } from '@/query/options/auth';
import { tastingNoteDetailQueryOptions } from '@/query/options/tasting-note';
import {
  FLAVOR_GROUPS_BEGINNER,
  FLAVOR_GROUPS_EXPERT,
  type BegFlavorItemDef,
  type FlavorItemDef,
} from '@/components/tasting-note/FlavorGroups';
import { createTastingNoteComment } from '@/api/tasting-note';
import { flattenRatingMapToTiles } from '@/lib/tasting-note';

const makeBegIconMap = (items: BegFlavorItemDef[]) =>
  new Map(items.map(item => [item.name, { iconSrc: item.iconSrc, iconActiveSrc: item.iconActiveSrc }]));

const makeExpertIconMap = (groups: { items: FlavorItemDef[] }[]) => {
  const flat = groups.flatMap(group => group.items);
  return new Map(flat.map(item => [item.name, { iconSrc: item.iconSrc, iconActiveSrc: item.iconActiveSrc }]));
};

const iconMap = new Map([...makeBegIconMap(FLAVOR_GROUPS_BEGINNER), ...makeExpertIconMap(FLAVOR_GROUPS_EXPERT)]);

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function FlavorSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; score: number }>;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-head5 text-black">{title}</h2>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {items.map(item => {
            const icons = iconMap.get(item.label);
            return (
              <FlavorTile
                key={`${title}-${item.label}`}
                label={item.label}
                score={item.score}
                iconSrc={icons?.iconSrc}
                iconActiveSrc={icons?.iconActiveSrc}
                active
                className="w-32"
              />
            );
          })}
        </div>
      ) : (
        <p className="text-body2 text-grey-700">선택된 향미 정보가 없습니다.</p>
      )}
    </section>
  );
}

export default function TastingNoteDetailPage() {
  const params = useParams<{ id: string }>();
  const noteId = Number(params?.id);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: currentUserId } = useQuery(authQueryOptions);
  const { data, isLoading, isError } = useQuery(tastingNoteDetailQueryOptions(noteId));

  const aromaItems = useMemo(
    () => (data ? flattenRatingMapToTiles(data.aromaNote) : []),
    [data]
  );
  const palateItems = useMemo(
    () => (data ? flattenRatingMapToTiles(data.palateNote) : []),
    [data]
  );
  const finishItems = useMemo(
    () => (data ? flattenRatingMapToTiles(data.finishNote) : []),
    [data]
  );

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      createTastingNoteComment(noteId, {
        parentId: null,
        content,
        createdTime: new Date().toISOString(),
      }),
    onSuccess: async () => {
      setComment('');
      toast.success('댓글을 등록했어요.', { duration: 1200 });
      await queryClient.invalidateQueries({
        queryKey: ['tasting-note', 'detail', noteId],
      });
    },
    onError: error => {
      const message = error instanceof Error ? error.message : '댓글 등록에 실패했어요.';
      toast.error(message, { duration: 1500 });
    },
  });

  const handleSubmitComment = async () => {
    const trimmed = comment.trim();

    if (!currentUserId) {
      toast.info('로그인 후 댓글을 작성할 수 있어요.', { duration: 1200 });
      return;
    }

    if (!trimmed) {
      toast.info('댓글 내용을 입력해주세요.', { duration: 1200 });
      return;
    }

    if (commentMutation.isPending) {
      return;
    }

    await commentMutation.mutateAsync(trimmed);
  };

  if (!Number.isFinite(noteId) || noteId <= 0) {
    return <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-red-600">잘못된 노트 경로입니다.</div>;
  }

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-grey-700">불러오는 중...</div>;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-grey-700">
        테이스팅 노트를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8 md:px-8">
      <BackButton>Tasting Note</BackButton>

      <section className="rounded-2xl border border-grey-300 bg-white px-6 py-7 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-body3 text-grey-700">
            <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-brown">
              Tasting Note
            </span>
            <span>작성자 {data.writerName}</span>
            <span>작성일 {formatDate(data.createdAt)}</span>
          </div>

          <h1 className="text-head3 text-black">{data.title}</h1>

          <div className="flex flex-wrap gap-4 text-body2 text-grey-800">
            <span>좋아요 {data.likeCount}</span>
            <span>비추천 {data.unlikeCount}</span>
            <span>조회수 {data.viewCount}</span>
            <span>댓글 {data.comments.length}</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-grey-300 bg-white p-6 shadow-sm">
        {data.images.length > 0 ? (
          <ImageGallery images={data.images} />
        ) : (
          <div className="rounded-xl bg-grey-100 px-4 py-10 text-center text-body2 text-grey-700">
            등록된 이미지가 없습니다.
          </div>
        )}
      </section>

      <div className="flex flex-col gap-8 rounded-2xl border border-grey-300 bg-white p-6 shadow-sm">
        <FlavorSection title="Aroma" items={aromaItems} />
        <FlavorSection title="Palate" items={palateItems} />
        <FlavorSection title="Finish" items={finishItems} />
      </div>

      <section className="rounded-2xl border border-grey-300 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-head5 text-black">Comments</h2>
          <span className="text-body3 text-grey-700">{data.comments.length}개</span>
        </div>

        <div className="flex flex-col gap-3">
          <textarea
            value={comment}
            onChange={event => setComment(event.target.value)}
            rows={4}
            placeholder="댓글을 남겨보세요."
            className="w-full resize-y rounded-xl border border-grey-300 bg-white px-4 py-3 text-body2 outline-none focus:border-brown"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void handleSubmitComment()}
              disabled={commentMutation.isPending}
              className="rounded-xl bg-yellow-main px-5 py-2 text-button text-brown disabled:cursor-not-allowed disabled:opacity-60"
            >
              {commentMutation.isPending ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col divide-y divide-grey-300">
          {data.comments.length > 0 ? (
            data.comments.map(item => (
              <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-3 text-body3 text-grey-700">
                  <span className="font-semibold text-black">{item.writerNickname}</span>
                  <span>{formatDate(item.createdAt)}</span>
                  <span>좋아요 {item.likeCount}</span>
                  <span>비추천 {item.unlikeCount}</span>
                  {item.parentId !== null && <span>답글</span>}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-body2 text-black">{item.content}</p>
              </article>
            ))
          ) : (
            <p className="py-4 text-body2 text-grey-700">아직 댓글이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
