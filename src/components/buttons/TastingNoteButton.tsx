'use client';

import { ButtonHTMLAttributes } from 'react';

import CustomButton from '../common/CustomButton';
import TastingNoteIcon from '../svg/TastingNoteIcon';

type TastingNoteButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function TastingNoteButton({ className, ...props }: TastingNoteButtonProps) {
  return (
    <CustomButton
      {...props}
      className={`rounded-md gap-[2rem] bg-[var(--color-yellow-200)] px-[2.8rem] text-caption text-[var(--color-black)] hover:bg-[var(--color-yellow-500)] ${className ?? ''}`}
      icon={<TastingNoteIcon />}
      iconPosition="left"
    >
      테이스팅 노트 작성하기
    </CustomButton>
  );
}
