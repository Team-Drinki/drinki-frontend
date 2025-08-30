'use client';

import { EllipsisVertical } from 'lucide-react';
import CustomTooltip from '../common/CustomTooltip';

export default function PostActionMenu({ postId, isOwner }: { postId: string; isOwner: boolean }) {
  const options = isOwner
    ? [
        { key: 'edit', label: '수정', onSelect: () => console.log(`${postId} 수정🚨`) },
        { key: 'delete', label: '삭제', onSelect: () => console.log(`${postId} 삭제`) },
      ]
    : [{ key: 'report', label: '신고', onselect: () => console.log(`${postId} 신고 접수🚨`) }];

  return <CustomTooltip trigger={<EllipsisVertical size={24} />} options={options} />;
}
