'use client';

import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

/**
 * @module SvgWrapper
 * @description
 * - SVG 아이콘에 크기, 색상, viewBox 등 공통 속성을 유연하게 부여할 수 있는 래퍼입니다.
 * - 모든 SVG 속성을 지원하며, 접근성과 스타일을 쉽게 통제할 수 있습니다.
 *
 * @example
 * ```tsx
 * <SvgWrapper size={24} color="#FF9900" viewBox="0 0 24 24" onClick={...}>
 *   <path d="M5 0 L15 10 L5 20 Z" />
 * </SvgWrapper>
 * ```
 *
 * @prop {number} [size=24] - width/height(px) 단위
 * @prop {string} [color=currentColor] - fill 색상
 * @prop {string} [viewBox=0 0 24 24] - viewBox 정의
 */

interface SvgWrapperProps extends ComponentProps<'svg'> {
  children: ReactNode;
  size?: number;
  color?: string;
  viewBox?: string;
}

export default function SvgWrapper({
  children,
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  className,
  ...props
}: SvgWrapperProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      {...props}
    >
      {children}
    </svg>
  );
}
