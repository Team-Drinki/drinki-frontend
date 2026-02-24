'use client';

import { useState } from 'react';
import FlavorItem from '@/components/tasting-note/FlavorItem';
import {
  FLAVOR_GROUPS_BEGINNER,
  type BegFlavorItemDef,
} from '@/components/tasting-note/FlavorGroups';

export type FlavorGroup = 'Aroma' | 'Palate' | 'Finish';
export type FlavorGroupSelection = Record<FlavorGroup, Record<string, number>>;

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
      {/* Tabs */}
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

      {/* Beginner 그리드*/}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {FLAVOR_GROUPS_BEGINNER.map((item: BegFlavorItemDef) => {
          const selected = !!value[tab]?.[item.name];
          const intensity = value[tab]?.[item.name] ?? 0;
          return (
            <FlavorItem
              key={`${tab}:${item.name}`}
              label={item.name}
              iconSrc={item.iconSrc}
              iconActiveSrc={item.iconActiveSrc}
              isSelected={selected}
              intensity={intensity}
              onSelect={() => setScore(tab, item.name, 2.5)}
              onDeselect={() => setScore(tab, item.name, 0)}
              onIntensityChange={v => setScore(tab, item.name, v)}
            />
          );
        })}
      </div>
    </div>
  );
}
