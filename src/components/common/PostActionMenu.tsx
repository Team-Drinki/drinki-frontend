'use client';

import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deletePost, toApiErrorMessage } from '@/api/posts';
import CustomTooltip from '../common/CustomTooltip';

export default function PostActionMenu({ postId, isOwner }: { postId: string; isOwner: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting || !window.confirm('게시글을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      toast.success('게시글이 삭제되었습니다.');
      router.replace('/community');
      router.refresh();
    } catch (error) {
      toast.error(await toApiErrorMessage(error, '게시글 삭제에 실패했습니다.'));
      setIsDeleting(false);
    }
  };

  const options = isOwner
    ? [
        {
          key: 'edit',
          label: '수정',
          onSelect: () => router.push(`/community/edit?postId=${encodeURIComponent(postId)}`),
          disabled: isDeleting,
        },
        {
          key: 'delete',
          label: isDeleting ? '삭제 중...' : '삭제',
          onSelect: () => void handleDelete(),
          disabled: isDeleting,
        },
      ]
    : [{ key: 'report', label: '신고 (준비 중)', disabled: true }];

  return <CustomTooltip trigger={<EllipsisVertical size={24} />} options={options} />;
}
