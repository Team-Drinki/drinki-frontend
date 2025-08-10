import Image from 'next/image';
import { Ellipsis } from 'lucide-react';
import Heart from '@/components/svg/Heart';
import CustomTooltip from '../common/CustomTooltip';
interface CommentProps {
  nickname: string;
  date: string;
  content: string;
  likes: number;
  avatarUrl: string;
}

export default function Comment({ nickname, date, content, likes, avatarUrl }: CommentProps) {
  return (
    <div className="flex flex-col gap-2.5 py-6">
      <div className="flex place-content-between">
        <div className="flex items-center gap-2.5">
          <Image src={avatarUrl} alt="profile" width={50} height={50} className="rounded-full" />
          <span className="text-head6 text-black">{nickname}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-caption text-black">{date}</span>
          <CustomTooltip
            trigger={<Ellipsis size={24} />}
            options={[
              {
                key: 'report',
                label: '신고',
                onSelect: () => console.log('신고'),
              },
            ]}
          />
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
