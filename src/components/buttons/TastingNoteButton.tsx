'use client';

import { ButtonHTMLAttributes } from 'react';

import CustomButton from '../common/CustomButton';
import TastingNoteIcon from '../svg/TastingNoteIcon';

interface TastingNoteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function TastingNoteButton({ className, ...props }: TastingNoteButtonProps) {
  return (
    <CustomButton
      className={`rounded-md text-caption text-[var(--color-black)] gap-[2rem] bg-[var(--color-yellow-200)] hover:bg-[var(--color-yellow-500)] px-[2.8rem] ${className ?? ''}`}
      icon={<TastingNoteIcon />}
      iconPosition="left"
    >
      테이스팅 노트 작성하기
    </CustomButton>
  );
}
