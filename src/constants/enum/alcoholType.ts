const AlcoholCategory = {
  WHISKEY: '위스키',
  WINE: '와인',
  OTHER: '기타',
} as const;

const SubAlcoholCategory = {
  SINGLE_MALT: '싱글몰트',
  BLENDED: '블렌디드',
  BOURBON: '버번',
  RED: 'Red',
  WHITE: 'White',
  SPARKLING: 'Sparkling',
  ROSE: 'Rose',
  SAKE: '사케',
  CHINESE_LIQUOR: '중국술',
  TRADITIONAL: '전통주',
} as const;

type AlcoholKey = keyof typeof AlcoholCategory;
type AlcoholLabel = (typeof AlcoholCategory)[AlcoholKey];
type SubAlcoholKey = keyof typeof SubAlcoholCategory;
type SubAlcoholLabel = (typeof SubAlcoholCategory)[SubAlcoholKey];

export { AlcoholCategory, SubAlcoholCategory };
export type { AlcoholKey, AlcoholLabel, SubAlcoholKey, SubAlcoholLabel };
