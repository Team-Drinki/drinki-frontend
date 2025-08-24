'use client';

import { useMemo, useState } from 'react';

export type FlavorGroup = 'Aroma' | 'Palate' | 'Finish';
export type FlavorGroupSelection = Record<FlavorGroup, Record<string, number>>;

const VOCABS: Record<FlavorGroup, string[]> = {
  Aroma: [
    '꿀,설탕,시럽',
    '카라멜',
    '바닐라,버터',
    '사과,배',
    '감귤',
    '바나나,망고',
    '말린 자두, 무화과',
    '체리,라즈베리',
    '곡물,빵,견과류',
    '시나몬',
    '초콜릿,커피',
    '바다',
    '나무',
    '약품',
  ],
  Palate: [
    '꿀,설탕,시럽',
    '카라멜',
    '바닐라,버터',
    '사과,배',
    '감귤',
    '바나나,망고',
    '말린 자두, 무화과',
    '체리,라즈베리',
    '곡물,빵,견과류',
    '시나몬',
    '초콜릿,커피',
    '바다',
    '나무',
    '약품',
  ],
  Finish: [
    '꿀,설탕,시럽',
    '카라멜',
    '바닐라,버터',
    '사과,배',
    '감귤',
    '바나나,망고',
    '말린 자두, 무화과',
    '체리,라즈베리',
    '곡물,빵,견과류',
    '시나몬',
    '초콜릿,커피',
    '바다',
    '나무',
    '약품',
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
  const cols = Math.ceil(VOCABS[tab].length / 2);
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

      <div
        className="grid grid-cols-2 gap-3 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ ['--cols' as any]: Math.ceil(VOCABS[tab].length / 2) }}
      >
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
