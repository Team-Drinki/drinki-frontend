export type TastingNoteBoardCategory = '위스키' | '와인' | '기타';

export const TASTING_NOTE_BOARD_CATEGORIES: TastingNoteBoardCategory[] = ['위스키', '와인', '기타'];

const DIRECT_CATEGORY_NAMES = new Set<TastingNoteBoardCategory>(['위스키', '와인']);

export function normalizeCategoryName(value?: string) {
  return (value ?? '').trim();
}

export function matchesTastingNoteBoardCategory(
  alcoholCategory: string | undefined,
  boardCategory: TastingNoteBoardCategory | string
) {
  const selected = normalizeCategoryName(boardCategory);
  if (!selected) {
    return true;
  }

  const category = normalizeCategoryName(alcoholCategory);
  if (!category) {
    return false;
  }

  if (selected === '기타') {
    return !DIRECT_CATEGORY_NAMES.has(category as TastingNoteBoardCategory);
  }

  return category === selected;
}
