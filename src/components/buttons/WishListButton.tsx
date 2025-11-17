'use client';
import { useState } from 'react';

import CustomButton from '../common/CustomButton';
import Heart from '../svg/Heart';

export default function WishListButton() {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleToggleWishList = () => setIsWishlisted(prev => !prev);

  return (
    <CustomButton
      className={`rounded-md text-caption text-[var(--color-black)] gap-[2rem] ${isWishlisted ? 'bg-[var(--color-yellow-200)]' : 'bg-[var(--color-grey-300)]'} hover:bg-[var(--color-yellow-300)]`}
      icon={<Heart fill={isWishlisted} />}
      iconPosition="left"
      aria-pressed={isWishlisted}
      onClick={handleToggleWishList}
    >
      위시리스트
    </CustomButton>
  );
}
