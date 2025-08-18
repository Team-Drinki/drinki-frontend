import Comment from './Comment';
import CommentForm from './CommentForm';
import Heart from '../svg/Heart';
import CommentIcon from '../svg/CommentIcon';
import { communityPostsDetail } from '@/app/mockup';
import { mockComments } from '@/lib/comments/mockComments';
import { buildCommentTree, type CommentNode } from '@/lib/comments/buildCommentTree';

export default async function CommentSection({ postId }: { postId: string }) {
  const tree = buildCommentTree(mockComments);
  const data = communityPostsDetail.find(post => post.id === postId);

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
        </li>
      ))}
    </ul>
  );

  return (
    <section className="flex flex-col gap-5 my-5">
      <div className="flex gap-5 ml-5 text-head6 text-sub-1">
        <div className="flex gap-2 items-center">
          <Heart />
          <span>{data?.postLikes}</span>
        </div>
        <div className="flex gap-2 items-center">
          <CommentIcon />
          <span>{mockComments.length}</span>
        </div>
      </div>
      <div className="flex flex-col px-6 bg-grey-100 rounded-lg divide-y-1 divide-grey-400">
        {renderTree(tree)}
      </div>
      <CommentForm nickname="작성자 닉네임" />
    </section>
  );
}
