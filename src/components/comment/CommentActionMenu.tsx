'use client';

import { Ellipsis } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import CustomTooltip from '../common/CustomTooltip';

export default function CommentActionMenu({
  commentId,
  isOwner,
}: {
  commentId: number | string;
  isOwner: boolean;
}) {
  const options = isOwner
    ? [
        { key: 'edit', label: '수정', onSelect: () => console.log(`${commentId} 수정🚨`) },
        { key: 'delete', label: '삭제', onSelect: () => console.log(`${commentId} 삭제`) },
      ]
    : [{ key: 'report', label: '신고', onselect: () => console.log(`${commentId} 신고 접수🚨`) }];

  return (
    <CustomTooltip
      trigger={isOwner ? <EllipsisVertical size={24} /> : <Ellipsis size={24} />}
      options={options}
    />
  );
}
