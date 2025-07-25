'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * @module CustomButton
 * @description
 * - shadcn의 `<Button />`을 래핑한 재사용 가능한 커스텀 버튼 컴포넌트입니다.
 * - `variant`, `size`, `icon`, `fullWidth` 등을 조합해 버튼을 유연하게 커스터마이징할 수 있습니다.
 *
 * @example
 * ```tsx
 * <CustomButton icon={<HeartIcon />} variant="outline" fullWidth>
 *   좋아요
 * </CustomButton>
 * ```
 *
 * @prop {ReactNode} [icon] - 버튼 왼쪽에 렌더링할 아이콘
 * @prop {boolean} [fullWidth=false] - 버튼을 부모 너비만큼 확장할지 여부
 * @prop {string} [variant] - shadcn/ui의 variant 속성 (예: "default", "ghost", "outline")
 * @prop {string} [size] - shadcn/ui의 size 속성 (예: "sm", "lg")
 */
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function CustomButton({
  children,
  className,
  icon,
  iconPosition = 'left',
  ...props
}: CustomButtonProps) {
  return (
    <Button className={cn('gap-2', className)} {...props}>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </Button>
  );
}
