'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';

import CustomButton from '../common/CustomButton';
import Heart from '../svg/Heart';
import { authQueryOptions } from '@/query/options/auth';
import { addWish, removeWish } from '@/api/wish';

interface WishListButtonProps {
  alcoholId: number;
  initialIsWish?: boolean;
}

export default function WishListButton({ alcoholId, initialIsWish = false }: WishListButtonProps) {
  const { data: userId } = useQuery(authQueryOptions);
  const isAuthenticated = userId !== null && userId !== undefined;
  const [isWishlisted, setIsWishlisted] = useState(initialIsWish);

  const toggleWishMutation = useMutation({
    mutationFn: async (nextState: boolean) =>
      nextState ? addWish(alcoholId) : removeWish(alcoholId),
    retry: false,
    onSuccess: (_, nextState) => {
      toast.success(nextState ? '위시리스트에 추가했어요.' : '위시리스트에서 삭제했어요.', {
        duration: 1000,
      });
    },
    onError: (error, nextState) => {
      setIsWishlisted(!nextState);
      const message =
        error instanceof Error ? error.message : '위시리스트 처리 중 문제가 발생했어요.';
      toast.error(message, { duration: 1000 });
    },
  });

  useEffect(() => {
    setIsWishlisted(initialIsWish);
  }, [initialIsWish]);

  const handleToggleWishList = async () => {
    if (!isAuthenticated) {
      toast.info('로그인 후 이용해 주세요.', { duration: 1000 });
      return;
    }

    if (toggleWishMutation.isPending) {
      return;
    }

    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    await toggleWishMutation.mutateAsync(nextState);
  };

  return (
    <CustomButton
      className={`rounded-md text-caption text-[var(--color-black)] gap-[2rem] ${isWishlisted ? 'bg-[var(--color-yellow-200)]' : 'bg-[var(--color-grey-300)]'} hover:bg-[var(--color-yellow-300)]`}
      icon={<Heart fill={isWishlisted} />}
      iconPosition="left"
      aria-pressed={isWishlisted}
      disabled={toggleWishMutation.isPending}
      onClick={handleToggleWishList}
    >
      위시리스트
    </CustomButton>
  );
}
