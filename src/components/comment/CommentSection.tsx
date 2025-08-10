import Comment from './Comment';
import CommentForm from './CommentForm';
import { comments } from '@/app/mockup';
import Heart from '../svg/Heart';
import Image from 'next/image';
import CommentIcon from '../svg/CommentIcon';
interface CommentProps {
  id: number;
  nickname: string;
  date: string;
  content: string;
  likes: number;
  avatarUrl: string;
}
export default function CommentSection() {
  return (
    <div className="flex flex-col gap-5 my-5">
      <div className="flex gap-5 ml-5 text-head6 text-sub-1">
        <div className="flex gap-2 items-center">
          <Heart />
          <span>21</span>
        </div>
        <div className="flex gap-2 items-center">
          <CommentIcon />
          {/* <Image src="/images/commentIcon.svg" width={24} height={24} alt="commentIcon" /> */}
          <span>{comments.length}</span>
        </div>
      </div>
      <div className="flex flex-col px-6 bg-grey-100 rounded-lg divide-y-1 divide-grey-400">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            nickname={comment.nikname}
            date={comment.date}
            content={comment.content}
            likes={comment.likes}
            avatarUrl={comment.avatarUrl}
          />
        ))}
      </div>
      <CommentForm nickname="작성자 닉네임" />
    </div>
  );
}
