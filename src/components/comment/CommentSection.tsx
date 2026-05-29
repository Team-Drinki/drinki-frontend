'use client';

import Comment from './Comment';
import CommentForm from './CommentForm';
import Heart from '../svg/Heart';
import CommentIcon from '../svg/CommentIcon';
import { mockComments } from '@/lib/comments/mockComments';
import { buildCommentTree, type CommentNode } from '@/lib/comments/buildCommentTree';
import { ReplyComposerProvider } from './ReplyComposerContext';
import ReplySlot from './ReplySlot';

export default function CommentSection({
  postId,
  likeCount = 0,
  commentCount = mockComments.length,
  isLiked = false,
  isLikePending = false,
  onToggleLike,
}: {
  postId: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  isLikePending?: boolean;
  onToggleLike?: () => void;
}) {
  const tree = buildCommentTree(mockComments);

  const renderTree = (nodes: CommentNode[], depth = 0) => (
    <ul className={depth === 0 ? 'divide-y divide-grey-400' : 'space-y-0'}>
      {nodes.map(n => (
        <li key={n.id}>
          <Comment
            commentId={n.id}
            authorId={n.authorId}
            nickname={n.author}
            date={new Date(n.createdAt).toLocaleString()}
            content={n.content}
            likes={n.likes ?? 0}
            avatarUrl={n.avatarUrl}
            depth={depth}
          />
          {n.children.length > 0 && renderTree(n.children, depth + 1)}
          <ReplySlot postId={postId} parentId={n.id} depth={depth} />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="flex flex-col gap-5 my-5">
      <div className="flex gap-5 ml-5 text-head6 text-sub-1">
        <button
          type="button"
          className="flex gap-2 items-center disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onToggleLike}
          disabled={!onToggleLike || isLikePending}
          aria-pressed={isLiked}
        >
          <Heart fill={isLiked} />
          <span>{likeCount}</span>
        </button>
        <div className="flex gap-2 items-center">
          <CommentIcon />
          <span>{commentCount}</span>
        </div>
      </div>
      <ReplyComposerProvider>
        <div className="flex flex-col px-6 bg-grey-100 rounded-lg divide-y-1 divide-grey-400">
          {renderTree(tree)}
        </div>
      </ReplyComposerProvider>
      <CommentForm nickname="작성자 닉네임" postId={postId} />
    </section>
  );
}
