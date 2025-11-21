export type FlavorItemDef = {
  name: string;
  iconSrc: string;
  iconActiveSrc: string;
  alt?: string;
};
export type FlavorGroupDef = {
  key: string;
  label: string;
  info: string;
  items: FlavorItemDef[];
};

// Beginner 전용 아이템 스키마
export type BegFlavorItemDef = {
  name: string;
  iconSrc?: string;
  iconActiveSrc?: string;
  alt?: string;
};

/* beginner version FlavorSelector components  
  name : 예시  키워드
  Todo -> 나중에 혹시 category로 연결시켜야 할수도? 
*/
export const FLAVOR_GROUPS_BEGINNER: BegFlavorItemDef[] = [
  {
    name: '꿀,설탕,시럽',
    iconSrc: '/images/icon/beg_sugarHoneySyrup.png',
    iconActiveSrc: '/images/selectedIcon/beg_sugarHoneySyrup.png',
    alt: '꿀 설탕 시럽 아이콘',
  },

  {
    name: '카라멜',
    iconSrc: '/images/icon/beg_ceramel.png',
    iconActiveSrc: '/images/selectedIcon/beg_ceramel.png',
    alt: '카라멜 아이콘',
  },

  {
    name: '바닐라,버터',
    iconSrc: '/images/icon/beg_vanillaButter.png',
    iconActiveSrc: '/images/selectedIcon/beg_vanillaButter.png',
    alt: '바닐라,버터',
  },
  {
    name: '사과,배',
    iconSrc: '/images/icon/beg_pearApple.png',
    iconActiveSrc: '/images/selectedIcon/beg_pearApple.png',
    alt: '사과 배 아이콘',
  },
  {
    name: '감귤',
    iconSrc: '/images/icon/beg_tangerines.png',
    iconActiveSrc: '/images/selectedIcon/beg_tangerines.png',
    alt: '감귤 아이콘',
  },
  {
    name: '바나나,망고',
    iconSrc: '/images/icon/beg_bananaMango.png',
    iconActiveSrc: '/images/selectedIcon/beg_bananaMango.png',
    alt: '바나나,망고 아이콘',
  },
  {
    name: '말린 자두,무화과',
    iconSrc: '/images/icon/beg_driedPlumsFig.png',
    iconActiveSrc: '/images/selectedIcon/beg_driedPlumsFig.png',
    alt: '말린 자두, 무화과 아이콘',
  },
  {
    name: '체리,라즈베리',
    iconSrc: '/images/icon/beg_cherryRaspberry.png',
    iconActiveSrc: '/images/selectedIcon/beg_cherryRaspberry.png',
    alt: '체리,라즈베리 아이콘',
  },
  {
    name: '곡물,빵,견과류',
    iconSrc: '/images/icon/beg_breadNutGrain.png',
    iconActiveSrc: '/images/selectedIcon/beg_breadNutGrain.png',
    alt: '곡물,빵,견과류 아이콘',
  },
  {
    name: '시나몬',
    iconSrc: '/images/icon/beg_cinamon.png',
    iconActiveSrc: '/images/selectedIcon/beg_cinamon.png',
    alt: '시나몬 아이콘',
  },
  {
    name: '초콜릿,커피',
    iconSrc: '/images/icon/beg_chocolateCoffee.png',
    iconActiveSrc: '/images/selectedIcon/beg_chocolateCoffee.png',
    alt: '초콜릿 커피 아이콘',
  },
  {
    name: '바다',
    iconSrc: '/images/icon/beg_sea.png',
    iconActiveSrc: '/images/selectedIcon/beg_sea.png',
    alt: '바다 아이콘',
  },
  {
    name: '나무',
    iconSrc: '/images/icon/beg_wood.png',
    iconActiveSrc: '/images/selectedIcon/beg_wood.png',
    alt: '나무 아이콘',
  },
  {
    name: '약품',
    iconSrc: '/images/icon/beg_medicine.png',
    iconActiveSrc: '/images/selectedIcon/beg_medicine.png',
    alt: '약품 아이콘',
  },
];

/* expert version FlavorSelector components  
key , label : category 
info : 대표 화합물
items : icon & 예시 키워드
*/

export const FLAVOR_GROUPS_EXPERT = [
  {
    key: 'natural-sweet',
    label: '은은한 단맛 (Natural Sweet)',
    info: '에틸 락테이트와 알데하이드류가 꿀이나 시럽 같은 단맛을 내며, 발효 과정에서 생기는 에스터와 남아 있는 당분이 주된 원인입니다.',
    items: [
      {
        name: '꿀',
        iconSrc: '/images/icon/honey.png',
        iconActiveSrc: '/images/selectedIcon/honey.png',
        alt: '꿀 아이콘',
      },
      {
        name: '시럽',
        iconSrc: '/images/icon/syrup.png',
        iconActiveSrc: '/images/selectedIcon/syrup.png',
        alt: '시럽 아이콘',
      },
    ],
  },
  {
    key: 'caramelized',
    label: '카라멜 단맛 (Caramelized)',
    info: '퓨란과 멜라노이딘이 카라멜·토피 같은 풍미를 주며, 몰트 건조(킬닝)나 오크통 토스팅 시 일어나는 마이야르 반응과 고온 캐러멜화가 핵심입니다.',
    items: [
      {
        name: '카라멜',
        iconSrc: '/images/icon/ceramel.png',
        iconActiveSrc: '/images/selectedIcon/ceramel.png',
        alt: '카라멜',
      },
      {
        name: '토피',
        iconSrc: '/images/icon/toffee.png',
        iconActiveSrc: '/images/selectedIcon/toffee.png',
        alt: '토피 아이콘',
      },
    ],
  },
  {
    key: 'creamy',
    label: '크리미/우유 (Creamy)',
    info: '바닐린과 다이아세틸이 크리미하고 버터리한 향을 만듭니다. 오크 리그닌이 분해되며 바닐라 향이 나오고, 발효·증류 중 생성되는 다이아세틸이 크림 같은 느낌을 줍니다.',
    items: [
      {
        name: '바닐라',
        iconSrc: '/images/icon/vanilla.png',
        iconActiveSrc: '/images/selectedIcon/vanilla.png',
        alt: '바닐라 아이콘',
      },
      {
        name: '버터',
        iconSrc: '/images/icon/butter.png',
        iconActiveSrc: '/images/selectedIcon/butter.png',
        alt: '버터 아이콘',
      },
      {
        name: '크림',
        iconSrc: '/images/icon/cream.png',
        iconActiveSrc: '/images/selectedIcon/cream.png',
        alt: '크림 아이콘',
      },
    ],
  },
  {
    key: 'green-apple',
    label: '청사과향 (Green Apple)',
    info: '에틸 헥사노에이트와 헥사날이 청사과 같은 상큼한 향을 주며, 발효 중 지방산에서 만들어지거나 산화 과정에서 형성됩니다.',
    items: [
      {
        name: '사과',
        iconSrc: '/images/icon/apple.png',
        iconActiveSrc: '/images/selectedIcon/apple.png',
        alt: '사과 아이콘',
      },
      {
        name: '배',
        iconSrc: '/images/icon/pear.png',
        iconActiveSrc: '/images/selectedIcon/paer.png',
        alt: '배 아이콘 ',
      },
    ],
  },
  {
    key: 'citrus',
    label: '시트러스 (Citrus)',
    info: '리모넨, 시트랄, 에틸 부티레이트 등이 감귤·레몬 같은 상큼함을 주며, 발효 효모의 차이 또는 진/IPA 캐스크 피니시로 강화됩니다.',
    items: [
      {
        name: '감귤',
        iconSrc: '/images/icon/tangerines.png',
        iconActiveSrc: '/images/selectedIcon/tangerines.png',
        alt: '감귤 아이콘',
      },
      {
        name: '레몬',
        iconSrc: '/images/icon/lemon.png',
        iconActiveSrc: '/images/selectedIcon/lemon.png',
        alt: '레몬 아이콘',
      },
      {
        name: '오렌지 껍질',
        iconSrc: '/images/icon/orange.png',
        iconActiveSrc: '/images/selectedIcon/orange.png',
        alt: '오렌지 껍질',
      },
    ],
  },
  {
    key: 'tropical',
    label: '바나나/열대과일 (Tropical Fruity)',
    info: '이소아밀 아세테이트가 바나나·망고 향을 주며, 고온 발효나 특정 효모 사용 시 두드러집니다.',
    items: [
      {
        name: '바나나',
        iconSrc: '/images/icon/banana.png',
        iconActiveSrc: '/images/selectedIcon/banana.png',
        alt: '바나나 아이콘',
      },
      {
        name: '망고',
        iconSrc: '/images/icon/mango.png',
        iconActiveSrc: '/images/selectedIcon/mango.png',
        alt: '망고 아이콘',
      },
    ],
  },
  {
    key: 'dried-fruit',
    label: '건과일/다크 과일 (Dried Fruit)',
    info: '에틸 시네아메이트와 아세탈이 농축된 과일 풍미를 주며, 발효와 숙성 과정에서 산화와 농축으로 나타납니다.',
    items: [
      {
        name: '말린 자두',
        iconSrc: '/images/icon/driedPlums.png',
        iconActiveSrc: '/images/selectedIcon/driedPlums.png',
        alt: '말린 자두 아이콘',
      },
      {
        name: '무화과',
        iconSrc: '/images/icon/fig.png',
        iconActiveSrc: '/images/selectedIcon/fig.png',
        alt: '무화과 아이콘',
      },
    ],
  },
  {
    key: 'red-fruit',
    label: '붉은 계열 과일 (Red Fruit)',
    info: '페닐에틸알코올과 벤질알코올이 체리·라즈베리 같은 붉은 과일 향을 내며, 발효 효모와 셰리 캐스크 숙성이 큰 영향을 줍니다.',
    items: [
      {
        name: '체리',
        iconSrc: '/images/icon/cherry.png',
        iconActiveSrc: '/images/selectedIcon/cherry.png',
        alt: '체리 아이콘 ',
      },
      {
        name: '라즈베리',
        iconSrc: '/images/icon/raspberry.png',
        iconActiveSrc: '/images/selectedIcon/raspberry.png',
        alt: '라즈베리 아이콘',
      },
    ],
  },
  {
    key: 'nutty',
    label: '고소한 곡물/견과향 (Nutty/Cereal)',
    info: '피라진과 퓨라놀 성분이 빵, 견과류 풍미를 만들며, 주로 킬닝 시 마이야르 반응이나 토스팅된 캐스크에서 생성됩니다.',
    items: [
      {
        name: '곡물',
        iconSrc: '/images/icon/grain.png',
        iconActiveSrc: '/images/selectedIcon/grain.png',
        alt: '곡물 아이콘',
      },
      {
        name: '빵',
        iconSrc: '/images/icon/bread.png',
        iconActiveSrc: '/images/selectedIcon/bread.png',
        alt: '빵 아이콘',
      },
      {
        name: '견과류',
        iconSrc: '/images/icon/nuts.png',
        iconActiveSrc: '/images/selectedIcon/nuts.png',
        alt: '견과류 아이콘',
      },
    ],
  },
  {
    key: 'woody',
    label: '우디/탄닌 (Woody/Tannic)',
    info: '탄닌과 쿠마린이 나무·가죽 같은 풍미를 내며, 오크통 숙성 중 리그닌·셀룰로오스 분해와 산화에 의해 형성됩니다.',
    items: [
      {
        name: '나무',
        iconSrc: '/images/icon/wood.png',
        iconActiveSrc: '/images/selectedIcon/wood.png',
        alt: '나무 아이콘',
      },
      {
        name: '가죽',
        iconSrc: '/images/icon/leather.png',
        iconActiveSrc: '/images/selectedIcon/leather.png',
        alt: '가죽 아이콘',
      },
    ],
  },
  {
    key: 'spicy',
    label: '스파이시 (Spicy)',
    info: '유게놀과 쿠마린이 향신료 느낌을 주며, 특히 유럽 오크 숙성 시 토스팅 강도에 따라 다양하게 변합니다.',
    items: [
      {
        name: '시나몬',
        iconSrc: '/images/icon/cinamon.png',
        iconActiveSrc: '/images/selectedIcon/cinamon.png',
        alt: '시나몬 아이콘',
      },
      {
        name: '후추',
        iconSrc: '/images/icon/pepper.png',
        iconActiveSrc: '/images/selectedIcon/pepper.png',
        alt: '후추 아이콘',
      },
    ],
  },
  {
    key: 'herbal',
    label: '허브/풀향 (Herbal/Grassy)',
    info: '헥사날, 헥세놀이 신선한 풀 향을 내며, 발효 중 지방 성분이 산화될 때 주로 생성됩니다.',
    items: [
      {
        name: '허브',
        iconSrc: '/images/icon/herb.png',
        iconActiveSrc: '/images/selectedIcon/herb.png',
        alt: '허브 아이콘',
      },
      {
        name: '풀',
        iconSrc: '/images/icon/grass.png',
        iconActiveSrc: '/images/selectedIcon/grass.png',
        alt: '풀 아이콘 ',
      },
    ],
  },
  {
    key: 'smoky',
    label: '스모키 (Smoky)',
    info: '구아이아콜, 4-메틸구아이아콜이 숯·그을음 향을 주며, 캐스크 차링이나 증류기 조건에 따라 강도가 달라집니다.',
    items: [
      {
        name: '숯',
        iconSrc: '/images/icon/charcoal.png',
        iconActiveSrc: '/images/selectedIcon/charcoal.png',
        alt: '숯 아이콘',
      },
      {
        name: '그을음',
        iconSrc: '/images/icon/soot.png',
        iconActiveSrc: '/images/selectedIcon/soot.png',
        alt: '그을음 아이콘',
      },
      {
        name: '재',
        iconSrc: '/images/icon/ash.png',
        iconActiveSrc: '/images/selectedIcon/ash.png',
        alt: '재 아이콘 ',
      },
    ],
  },
  {
    key: 'peaty',
    label: '피트 (Peaty)',
    info: '페놀, 크레졸, 티오페놀 등이 흙·바다·약품 같은 향을 내며, 몰트를 피트 연기로 건조할 때 흡착된 성분이 원인입니다.',
    items: [
      {
        name: '흙',
        iconSrc: '/images/icon/soil.png',
        iconActiveSrc: '/images/selectedIcon/soil.png',
        alt: '흙 아이콘',
      },
      {
        name: '바다',
        iconSrc: '/images/icon/sea.png',
        iconActiveSrc: '/images/selectedIcon/sea.png',
        alt: '바다 아이콘',
      },
      {
        name: '약품',
        iconSrc: '/images/icon/medicine.png',
        iconActiveSrc: '/images/selectedIcon/medicine.png',
        alt: '',
      },
    ],
  },
  {
    key: 'dark-roasted',
    label: '다크/로스티드 (Dark Roasted)',
    info: '갈산, 산화 페놀 등이 다크 초콜릿·커피 풍미를 주며, 고온 킬닝과 장기 숙성에서 나타납니다.',
    items: [
      {
        name: '다크 초콜릿',
        iconSrc: '/images/icon/darkChocolate.png',
        iconActiveSrc: '/images/selectedIcon/darkChocolate.png',
        alt: '다크 초콜릿 아이콘',
      },
      {
        name: '커피',
        iconSrc: '/images/icon/coffee.png',
        iconActiveSrc: '/images/selectedIcon/coffee.png',
        alt: '커피 아이콘 ',
      },
      {
        name: '코코아',
        iconSrc: '/images/icon/cocoa.png ',
        iconActiveSrc: '/images/selectedIcon/cocoa.png',
        alt: '코코아 아이콘',
      },
    ],
  },
  {
    key: 'sulfur',
    label: '황 향 (Sulfur)',
    info: '황화수소, 디메틸설파이드(DMS) 등이 성냥불·고무 같은 향을 내며, 발효 스트레스·포트스틸 컷 미흡·셰리 캐스크 숙성에서 강화되기도 합니다. 일부는 결점이지만 개성으로 남기는 경우도 있습니다.',
    items: [
      {
        name: '성냥불',
        iconSrc: '/images/icon/matchFire.png',
        iconActiveSrc: '/images/selectedIcon/matchFire.png',
        alt: '성냥불 아이콘',
      },
      {
        name: '고무',
        iconSrc: '/images/icon/rubber.png',
        iconActiveSrc: '/images/selectedIcon/rubber.png',
        alt: '고무 아이콘',
      },
      {
        name: '화약',
        iconSrc: '/images/icon/gunpowder.png',
        iconActiveSrc: '/images/selectedIcon/gunpowder.png',
        alt: '화약 아이콘',
      },
    ],
  },
];
