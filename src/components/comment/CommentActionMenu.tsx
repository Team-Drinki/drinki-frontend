'use client';

import { Ellipsis } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import CustomTooltip from '../common/CustomTooltip';

export default function CommentActionMenu({
  isOwner,
}: {
  commentId: number | string;
  isOwner: boolean;
}) {
  const options = isOwner
    ? [
        { key: 'edit', label: '수정 (준비 중)', disabled: true },
        { key: 'delete', label: '삭제 (준비 중)', disabled: true },
      ]
    : [{ key: 'report', label: '신고 (준비 중)', disabled: true }];

  return (
    <CustomTooltip
      trigger={isOwner ? <EllipsisVertical size={24} /> : <Ellipsis size={24} />}
      options={options}
    />
  );
}
