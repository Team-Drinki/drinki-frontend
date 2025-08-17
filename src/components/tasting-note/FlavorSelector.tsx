'use client';

import { useMemo, useState } from 'react';

export type FlavorGroup = 'Aroma' | 'Palate' | 'Finish';
export type FlavorGroupSelection = Record<FlavorGroup, Record<string, number>>;

const VOCABS: Record<FlavorGroup, string[]> = {
  Aroma: [
    '사과·배',
    '허니',
    '바닐라',
    '시트러스',
    '꽃향',
    '허브',
    '몰트·곡물',
    '스모크',
    '시나몬',
    '넛츠',
  ],
  Palate: [
    '꿀',
    '카라멜',
    '바닐라',
    '말티',
    '오크',
    '초콜릿',
    '건과일',
    '향신료',
    '시트러스',
    '소금기',
  ],
  Finish: [
    '짧음',
    '중간',
    '길음',
    '드라이',
    '스파이시',
    '스모키',
    '달콤함',
    '쓴맛',
    '따뜻함',
    '오일리',
  ],
};

export default function FlavorSelector({
  value,
  onChange,
}: {
  value: FlavorGroupSelection;
  onChange: (v: FlavorGroupSelection) => void;
}) {
  const [tab, setTab] = useState<FlavorGroup>('Aroma');

  const setScore = (group: FlavorGroup, label: string, score: number) => {
    const next = { ...value, [group]: { ...(value[group] || {}) } };
    if (score <= 0) delete next[group][label];
    else next[group][label] = score;
    onChange(next);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex gap-2">
        {(['Aroma', 'Palate', 'Finish'] as FlavorGroup[]).map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 text-sm transition
                ${active ? 'bg-amber-400 text-brown-900' : 'bg-white text-brown-700 border border-brown-200'}`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {VOCABS[tab].map(label => (
          <FlavorTile
            key={label}
            label={label}
            score={value[tab]?.[label] ?? 0}
            onChange={s => setScore(tab, label, s)}
          />
        ))}
      </div>
    </div>
  );
}

function FlavorTile({
  label,
  score,
  onChange,
}: {
  label: string;
  score: number; // 0~5 (0.5 step)
  onChange: (s: number) => void;
}) {
  const [showBubble, setShowBubble] = useState(false);

  const stateClass = useMemo(() => {
    if (score > 0) return 'bg-amber-300 border-amber-400';
    return 'bg-white border-brown-200 hover:border-amber-400';
  }, [score]);

  const setHalfStep = (n: number) => Math.max(0, Math.min(5, Math.round(n * 2) / 2));

  const toggleBubble = () => setShowBubble(v => !v);
  const keyToggle: React.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBubble();
    }
  };

  return (
    <div className="relative" onMouseLeave={() => setShowBubble(false)}>
      {/* 바깥을 div(role=button)로 변경 */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={showBubble}
        aria-label={`${label} intensity`}
        onClick={toggleBubble}
        onKeyDown={keyToggle}
        className={`group h-20 w-full rounded-lg border text-sm text-brown-800 transition ${stateClass}`}
      >
        <span className="px-3">{label}</span>

        {/* 선택 배지 & 제거 버튼 */}
        {score > 0 && (
          <>
            <span className="absolute bottom-1 left-1 rounded-md bg-white px-1.5 text-xs font-semibold">
              {score.toFixed(1)}
            </span>
            {/* 안쪽 삭제는 button 유지 (이제 중첩 아님) */}
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-white/90 px-1 text-xs shadow"
              onClick={e => {
                e.stopPropagation();
                onChange(0);
              }}
              aria-label="remove"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* Active 상태: 버블(슬라이더) */}
      {showBubble && (
        <div className="absolute left-1/2 z-20 -translate-x-1/2 -top-24 w-48 rounded-2xl border border-brown-300 bg-white p-3 shadow-md">
          <div className="mb-2 text-xs text-brown-800">강도 (0.0–5.0)</div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={score}
            onChange={e => onChange(setHalfStep(Number(e.target.value)))}
            className="w-full"
          />
          <div className="mt-1 text-right text-sm font-semibold text-brown-800">
            {score.toFixed(1)}
          </div>

          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white" />
          <div
            className="absolute -bottom-[9px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-9 border-t-9 border-x-transparent border-t-brown-300/60"
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}
