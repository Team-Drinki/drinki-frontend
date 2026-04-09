'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTastingNoteComment } from '@/api/tasting-note';
import Comment from '@/components/comment/Comment';
import CommentForm from '@/components/comment/CommentForm';
import { ReplyComposerProvider } from '@/components/comment/ReplyComposerContext';
import ReplySlot from '@/components/comment/ReplySlot';
import CommentIcon from '@/components/svg/CommentIcon';
import Heart from '@/components/svg/Heart';
import { buildCommentTree, type CommentNode } from '@/lib/comments/buildCommentTree';
import { toCommentTreeInput } from '@/lib/tasting-note';
import type { TastingNoteComment } from '@/schema/api/tasting-note';

function formatCommentDate(value: string) {
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

function TastingNoteCommentTree({
  noteId,
  comments,
  likeCount,
  isLikeActive,
  canWrite,
}: {
  noteId: number;
  comments: TastingNoteComment[];
  likeCount: number;
  isLikeActive: boolean;
  canWrite: boolean;
}) {
  const queryClient = useQueryClient();
  const tree = useMemo(() => buildCommentTree(toCommentTreeInput(comments)), [comments]);
  const [liked, setLiked] = useState(isLikeActive);
  const [displayLikeCount, setDisplayLikeCount] = useState(likeCount);

  useEffect(() => {
    setLiked(isLikeActive);
    setDisplayLikeCount(likeCount);
  }, [isLikeActive, likeCount]);

  const createCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId: number | null }) =>
      createTastingNoteComment(noteId, {
        content,
        parentId,
        createdTime: new Date().toISOString(),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasting-note', 'detail', noteId] });
      await queryClient.invalidateQueries({ queryKey: ['tasting-note'] });
      toast.success('댓글을 등록했어요.', { duration: 1200 });
    },
    onError: error => {
      const message = error instanceof Error ? error.message : '댓글 등록에 실패했어요.';
      toast.error(message, { duration: 1500 });
    },
  });

  const handleCreateComment = async (content: string, parentId: number | null = null) => {
    if (!canWrite) {
      toast.error('로그인 후 댓글을 작성할 수 있어요.', { duration: 1500 });
      return;
    }

    await createCommentMutation.mutateAsync({ content, parentId });
  };

  const handleToggleLike = () => {
    // 임시 저장: 백엔드 좋아요 API가 아직 없어 화면 상태와 count만 로컬에서 토글합니다.
    setLiked(prev => {
      const next = !prev;
      setDisplayLikeCount(count => {
        if (next) {
          return count + 1;
        }
        return Math.max(0, count - 1);
      });
      return next;
    });
  };

  const renderTree = (nodes: CommentNode[], depth = 0) => (
    <ul className={depth === 0 ? 'divide-y divide-[#e9dfd4]' : 'space-y-0'}>
      {nodes.map(node => (
        <li key={node.id}>
          <Comment
            commentId={node.id}
            authorId={node.authorId}
            nickname={node.author}
            date={formatCommentDate(node.createdAt)}
            content={node.content}
            likes={node.likes ?? 0}
            avatarUrl={node.avatarUrl}
            depth={depth}
            canReply={canWrite}
            showActionMenu={false}
          />
          {node.children.length > 0 && renderTree(node.children, depth + 1)}
          <ReplySlot
            postId={String(noteId)}
            parentId={node.id}
            depth={depth}
            nickname="답글 작성"
            disabled={!canWrite || createCommentMutation.isPending}
            submitLabel={createCommentMutation.isPending ? '등록 중...' : '등록'}
            placeholder={canWrite ? '답글을 작성해주세요.' : '로그인 후 답글을 작성할 수 있어요.'}
            onSubmitComment={async content => {
              await handleCreateComment(content, Number(node.id));
            }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="space-y-5 border-t border-[#efe5d9] pt-8">
      <div className="flex items-center gap-7 px-1 text-[#653205]">
        <button
          type="button"
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={handleToggleLike}
          aria-pressed={liked}
        >
          <span className="inline-flex scale-[1.22]">
            <Heart fill={liked} />
          </span>
          <span className="text-[1.5rem] font-semibold leading-none">{displayLikeCount}</span>
        </button>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex scale-[1.18]">
            <CommentIcon />
          </span>
          <span className="text-[1.5rem] font-semibold leading-none">{comments.length}</span>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="rounded-[24px] border border-[#efe5d9] bg-[#fcf8f3] px-5 sm:px-6">
          {renderTree(tree)}
        </div>
      )}

      <CommentForm
        nickname={canWrite ? '댓글 작성' : '로그인 후 댓글을 남길 수 있어요'}
        postId={String(noteId)}
        disabled={!canWrite || createCommentMutation.isPending}
        submitLabel={createCommentMutation.isPending ? '등록 중...' : '등록'}
        placeholder={canWrite ? '댓글을 작성해주세요.' : '로그인 후 댓글을 작성할 수 있어요.'}
        onSubmitComment={async content => {
          await handleCreateComment(content);
        }}
      />
    </section>
  );
}

export default function TastingNoteCommentSection({
  noteId,
  currentUserId,
  comments,
  likeCount,
  isLikeActive = false,
}: {
  noteId: number;
  currentUserId: number | null | undefined;
  comments: TastingNoteComment[];
  likeCount: number;
  isLikeActive?: boolean;
}) {
  return (
    <ReplyComposerProvider>
      <TastingNoteCommentTree
        noteId={noteId}
        comments={comments}
        likeCount={likeCount}
        isLikeActive={isLikeActive}
        canWrite={currentUserId !== null && currentUserId !== undefined}
      />
    </ReplyComposerProvider>
  );
}
