'use client';

import { useMemo, useState } from 'react';
import IntensityPopover from '@/components/tasting-note/IntensityPopover';

export type FlavorGroup = 'Aroma' | 'Palate' | 'Finish';
export type FlavorGroupSelection = Record<FlavorGroup, Record<string, number>>;

// beginner
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
              className={`rounded-lg px-3 py-1 text-sm transition
                ${active ? 'bg-amber-400 text-[#653205] font-semibold' : 'bg-white text-[#653205] border border-brown-200 font-semibold'}`}
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
  score: number; // 0~5
  onChange: (s: number) => void;
}) {
  const stateClass = useMemo(() => {
    return score > 0
      ? 'bg-[#FFF8E4] border-amber-400'
      : 'bg-white border-brown-200 hover:border-amber-400';
  }, [score]);

  // 클릭 시 선택/해제 토글(선택 시 기본값 2.5)
  const toggleSelect = () => (score > 0 ? onChange(0) : onChange(2.5));

  return (
    <IntensityPopover
      label={`${label} 강도 조절`}
      value={score}
      onChange={v => onChange(Math.max(0, Math.min(5, v)))}
      width={260}
      asChild
    >
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={toggleSelect} // 팝업 열리면서 선택 토글
          className={`group h-20 w-full rounded-lg border text-sm text-brown-800 transition ${stateClass}`}
        >
          <span className="px-3">{label}</span>

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
      </div>
    </IntensityPopover>
  );
}
