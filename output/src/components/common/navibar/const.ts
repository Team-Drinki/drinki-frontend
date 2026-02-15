type DrinkCategory = {
  category: string;
  subCategory: string[];
};
export const drinkCategories: DrinkCategory[] = [
  {
    category: '위스키',
    subCategory: ['싱글몰트', '블렌디드', '버번'],
  },
  {
    category: '와인',
    subCategory: ['레드', '화이트', '스파클링', '로제'],
  },
  {
    category: '기타',
    subCategory: ['사케', '중국술', '전통주'],
  },
];
