import Image from 'next/image';

type Props = {
  label: string;
  score: number; // 0~5
  /** 아이콘 경로 (없으면 배경만 보여줌) */
  iconSrc?: string;
  /** active 아이콘 경로(선택/강조 상태) */
  iconActiveSrc?: string;
  /** 상세 페이지는 기본적으로 active처럼 보여주고 싶다면 true */
  active?: boolean;
  className?: string;
};

export default function FlavorTile({
  label,
  score,
  iconSrc,
  iconActiveSrc,
  active = true,
  className,
}: Props) {
  const src = active ? iconActiveSrc ?? iconSrc : iconSrc;

  return (
    <div className={['relative flex flex-col items-center', className ?? ''].join(' ')}>
      <div
        className={[
          'relative h-24 w-28 overflow-hidden rounded-xl border bg-amber-300 transition',
          active ? 'border-[#402002] ring-2 ring-amber-400' : 'border-brown-200',
        ].join(' ')}
      >
        {/* 아이콘 (fill) */}
        {src && (
          <Image
            src={src}
            alt={label}
            fill
            sizes="112px"
            priority={false}
            className="object-contain pointer-events-none"
            style={{ transform: 'scale(1.09)' }}
          />
        )}

        {/* 점수 배지 */}
        <span
          className="absolute bottom-1 left-2 z-10 rounded-md bg-white/95 px-1.5 text-[12px] font-semibold shadow-sm"
          aria-label={`${label} 강도 ${score}`}
        >
          {Number.isFinite(score) ? score.toFixed(1) : '-'}
        </span>
      </div>

      {/* 라벨 */}
      <div className="mt-2 text-xs text-brown-800">{label}</div>
    </div>
  );
}