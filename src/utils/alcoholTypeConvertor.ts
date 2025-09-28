import { AlcoholCategory, SubAlcoholCategory } from '@/constants/enum/alcoholType';
import {
  AlcoholKey,
  AlcoholLabel,
  SubAlcoholKey,
  SubAlcoholLabel,
} from '@/constants/enum/alcoholType';

export function toAlcoholLabel(key: string): AlcoholLabel {
  return AlcoholCategory[key as AlcoholKey];
}

export function toAlcoholKey(label: AlcoholLabel): AlcoholKey | undefined {
  const entry = Object.entries(AlcoholCategory).find(([, v]) => v === label);
  return entry?.[0] as AlcoholKey | undefined;
}

export function toSubAlcoholLabel(key: string): SubAlcoholLabel {
  return SubAlcoholCategory[key as SubAlcoholKey];
}

export function toSubAlcoholKey(label: SubAlcoholLabel): SubAlcoholKey | undefined {
  const entry = Object.entries(SubAlcoholCategory).find(([, v]) => v === label);
  return entry?.[0] as SubAlcoholKey | undefined;
}
