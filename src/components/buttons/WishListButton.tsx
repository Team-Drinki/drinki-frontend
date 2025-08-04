'use client';
import CustomButton from '../common/CustomButton';
import Heart from '../svg/Heart';
import { useState } from 'react';

export default function WishListButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <CustomButton
      className={`w-25 h-8 rounded-md text-caption text-[var(--color-black)] ${isActive ? 'bg-[var(--color-yellow-200)]' : 'bg-[var(--color-grey-300)]'} hover:bg-[var(--color-yellow-300)]`}
      icon={<Heart fill={isActive} />}
      iconPosition="left"
      onClick={() => setIsActive(!isActive)}
    >
      <span>위시리스트</span>
    </CustomButton>
  );
}
