import type { FC } from 'react';

type Props = {
  size: number;
  className?: string;
};

/** 별 아이콘 (currentColor 기반) */
const StarSVG: FC<Props> = ({ size, className }) => {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.25l2.955 5.985 6.6.96-4.777 4.654 1.128 6.58L12 17.77l-5.906 3.659 1.128-6.58L2.445 9.195l6.6-.96L12 2.25z"
      />
    </svg>
  );
};

export default StarSVG;
