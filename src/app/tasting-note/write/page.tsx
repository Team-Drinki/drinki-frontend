'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import ImagePicker from '@/components/tasting-note/ImagePicker';
import StarRating from '@/components/tasting-note/StarRating';
import AppearanceBar, { type AppearanceColor } from '@/components/tasting-note/AppearanceBar';
import FlavorSelector, {
  type FlavorGroupSelection,
} from '@/components/tasting-note/FlavorSelector';
import IntensityPopover from '@/components/tasting-note/IntensityPopover';
import FlavorGroupCard from '@/components/tasting-note/FlavorGroupCard';

type WhiskyMeta = {
  name: string;
  abv: string;
  type: string;
  price: string;
  region: string;
  date: string;
};

const APPEARANCE_COLORS = [
  { key: 'pale', hex: '#FFEFAE', label: 'Pale' },
  { key: 'straw', hex: '#F7D25C', label: 'Straw' },
  { key: 'gold', hex: '#E29D2A', label: 'Gold' },
  { key: 'amber', hex: '#C15A2C', label: 'Amber' },
  { key: 'mahogany', hex: '#5F2B22', label: 'Mahogany' },
] as const;

export default function TastingNoteWritePage() {
  const [images, setImages] = useState<File[]>([]);
  const [mode, setMode] = useState<'beginner' | 'expert'>('beginner');
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [whisky, setWhisky] = useState<WhiskyMeta>({
    name: '',
    abv: '',
    type: '',
    price: '',
    region: '',
    date: '',
  });
  const [rating, setRating] = useState(0);
  const [appearance, setAppearance] = useState<AppearanceColor | null>(null);
  const [comment, setComment] = useState('');
  const [intensityMap, setIntensityMap] = useState<Record<string, number>>({});
  const handleSelectFlavor = (flavorId: string) => {
    setIntensityMap(prev => ({ ...prev, [flavorId]: 2.5 }));
  };
  const handleDeselectFlavor = (flavorId: string) => {
    setIntensityMap(prev => {
      const newMap = { ...prev };
      delete newMap[flavorId];
      return newMap;
    });
  };

  const handleIntensityChange = (flavorId: string, value: number) => {
    setIntensityMap(prev => ({ ...prev, [flavorId]: value }));
  };

  const [flavors, setFlavors] = useState<FlavorGroupSelection>({
    Aroma: {},
    Palate: {},
    Finish: {},
  });

  const handleSelect = (flavorId: string) => {
    setIntensityMap(prev => ({ ...prev, [flavorId]: 2.5 }));
  };

  const handleSubmit = () => {
    console.log('tasting-note submit', {
      mode,
      keyword,
      title,
      whisky,
      rating,
      appearance,
      comment,
      flavors,
    });
    alert('임시 저장: 콘솔에서 제출 페이로드 확인 가능');
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-6 py-8">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Link
            href="/tasting-note"
            className="flex items-center text-brown-800 hover:text-brown-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-head6 font-medium">Tasting Note</span>
          </Link>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* 상단 컨트롤 */}
          <div className="bg-yellow-100 border border-yellow-200 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  술 이름 검색
                </label>
                <Input
                  placeholder="술 이름을 검색해주세요 (아직 미구현)"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  className="w-full bg-white border-brown-200 focus:border-brown-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">제목</label>
                <Input
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white border-brown-200 focus:border-brown-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* 초심자 테이스팅 버튼 */}
            <Button
              onClick={() => setMode('beginner')}
              aria-pressed={mode === 'beginner'}
              className={`w-full rounded-lg shadow-sm py-3 border-2 transition
            ${
              mode === 'beginner'
                ? 'bg-[#FFD445] text-brown-900 border-[#402002] hover:bg-[#FFC933]'
                : 'bg-white text-brown-800 border-[#402002] hover:bg-brown-50'
            }`}
            >
              초심자를 위한 테이스팅 노트 작성 폼
            </Button>

            {/* 고수 테이스팅 버튼 */}
            <Button
              onClick={() => setMode('expert')}
              aria-pressed={mode === 'expert'}
              className={`w-full rounded-lg shadow-sm py-3 border-2 transition
             ${
               mode === 'expert'
                 ? 'bg-[#FFD445] text-brown-900 border-[#402002] hover:bg-[#FFC933]'
                 : 'bg-white text-brown-800 border-[#402002] hover:bg-brown-50'
             }`}
            >
              고수들을 위한 테이스팅 노트 작성 폼
            </Button>
          </div>

          <div className="mt-1">
            {mode === 'beginner' ? (
              <BeginnerForm
                images={images}
                setImages={setImages}
                whisky={whisky}
                setWhisky={setWhisky}
                rating={rating}
                setRating={setRating}
                appearance={appearance}
                setAppearance={setAppearance}
                flavors={flavors}
                setFlavors={setFlavors}
                comment={comment}
                setComment={setComment}
              />
            ) : (
              <ExpertForm
                images={images}
                setImages={setImages}
                whisky={whisky}
                setWhisky={setWhisky}
                rating={rating}
                setRating={setRating}
                appearance={appearance}
                setAppearance={setAppearance}
                flavors={flavors}
                setFlavors={setFlavors}
                comment={comment}
                setComment={setComment}
              />
            )}
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-2 rounded-lg font-medium"
            >
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BeginnerForm(props: {
  images: File[];
  setImages: (f: File[]) => void;
  whisky: WhiskyMeta;
  setWhisky: (u: WhiskyMeta) => void;
  rating: number;
  setRating: (n: number) => void;
  appearance: AppearanceColor | null;
  setAppearance: (c: AppearanceColor | null) => void;
  flavors: FlavorGroupSelection;
  setFlavors: (f: FlavorGroupSelection) => void;
  comment: string;
  setComment: (s: string) => void;
}) {
  const {
    images,
    setImages,
    whisky,
    setWhisky,
    rating,
    setRating,
    appearance,
    setAppearance,
    flavors,
    setFlavors,
    comment,
    setComment,
  } = props;

  return (
    <div className="rounded-lg bg-gray-100 p-6">
      {/* 사진 */}
      <section className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-brown-800">사진 (최대 3장)</h3>
        <ImagePicker images={images} onChange={setImages} max={3} />
      </section>

      {/* 메타 입력 */}
      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="위스키 이름"
          value={whisky.name}
          onChange={v => setWhisky({ ...whisky, name: v })}
        />
        <Field
          label="시음 날짜"
          value={whisky.date}
          onChange={v => setWhisky({ ...whisky, date: v })}
        />
        <Field
          label="알코올 도수"
          value={whisky.abv}
          onChange={v => setWhisky({ ...whisky, abv: v })}
        />
        <Field label="종류" value={whisky.type} onChange={v => setWhisky({ ...whisky, type: v })} />
        <Field
          label="가격"
          value={whisky.price}
          onChange={v => setWhisky({ ...whisky, price: v })}
        />
        <Field
          label="지역"
          value={whisky.region}
          onChange={v => setWhisky({ ...whisky, region: v })}
        />
        <StarRating value={rating} onChange={setRating} />
      </section>

      {/* Appearance */}
      <section className="mb-8">
        <h3 className="mb-2 text-sm font-semibold text-brown-800">Appearance (외관)</h3>
        <AppearanceBar value={appearance} onChange={setAppearance} />
      </section>

      {/* Aroma/Palate/Finish */}
      <section className="mb-8">
        <FlavorSelector value={flavors} onChange={setFlavors} />
      </section>

      {/* Comment */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-semibold text-brown-800">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={6}
          placeholder="자유롭게 시음 소감을 남겨주세요."
          className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
        />
      </div>
    </div>
  );
}

function ExpertForm(props: {
  images: File[];
  setImages: (f: File[]) => void;
  whisky: WhiskyMeta;
  setWhisky: (u: WhiskyMeta) => void;
  rating: number;
  setRating: (n: number) => void;
  appearance: AppearanceColor | null;
  setAppearance: (c: AppearanceColor | null) => void;
  flavors: FlavorGroupSelection;
  setFlavors: (f: FlavorGroupSelection) => void;
  comment: string;
  setComment: (s: string) => void;
}) {
  const {
    images,
    setImages,
    whisky,
    setWhisky,
    rating,
    setRating,
    appearance,
    setAppearance,
    flavors,
    setFlavors,
    comment,
    setComment,
  } = props;

  return (
    <div className="rounded-lg bg-gray-100 p-6">
      {/* 사진 */}
      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-brown-800">사진 (최대 3장)</h3>
        <ImagePicker images={images} onChange={setImages} max={3} />
      </section>

      {/* 메타 + 별점 */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="위스키 이름"
          value={whisky.name}
          onChange={v => setWhisky({ ...whisky, name: v })}
        />
        <Field
          label="시음 날짜"
          value={whisky.date}
          onChange={v => setWhisky({ ...whisky, date: v })}
        />
        <Field
          label="알코올 도수"
          value={whisky.abv}
          onChange={v => setWhisky({ ...whisky, abv: v })}
        />
        <Field label="종류" value={whisky.type} onChange={v => setWhisky({ ...whisky, type: v })} />
        <Field
          label="가격"
          value={whisky.price}
          onChange={v => setWhisky({ ...whisky, price: v })}
        />
        <Field
          label="지역"
          value={whisky.region}
          onChange={v => setWhisky({ ...whisky, region: v })}
        />
        <StarRating value={rating} onChange={setRating} />
      </section>

      {/* 외관 */}
      <section className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-brown-800">Appearance (외관)</h3>
        <AppearanceBar value={appearance} onChange={setAppearance} detailed />
      </section>

      {/* 세부 향미 그룹 (드롭다운 카드) */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: 'natural-sweet',
            label: '은은한 단맛 (Natural Sweet)',
            info: '에틸 락테이트와 알데하이드류가 꿀이나 시럽 같은 단맛을 내며, 발효 과정에서 생기는 에스터와 남아 있는 당분이 주된 원인입니다.',
            items: ['꿀', '시럽'],
          },
          {
            key: 'caramelized',
            label: '카라멜 단맛 (Caramelized)',
            info: '퓨란과 멜라노이딘이 카라멜·토피 같은 풍미를 주며, 몰트 건조(킬닝)나 오크통 토스팅 시 일어나는 마이야르 반응과 고온 캐러멜화가 핵심입니다.',
            items: ['카라멜', '토피'],
          },
          {
            key: 'creamy',
            label: '크리미/우유 (Creamy)',
            info: '바닐린과 다이아세틸이 크리미하고 버터리한 향을 만듭니다. 오크 리그닌이 분해되며 바닐라 향이 나오고, 발효·증류 중 생성되는 다이아세틸이 크림 같은 느낌을 줍니다.',
            items: ['바닐라', '버터', '크림'],
          },
          {
            key: 'green-apple',
            label: '청사과향 (Green Apple)',
            info: '에틸 헥사노에이트와 헥사날이 청사과 같은 상큼한 향을 주며, 발효 중 지방산에서 만들어지거나 산화 과정에서 형성됩니다.',
            items: ['사과', '배'],
          },
          {
            key: 'citrus',
            label: '시트러스 (Citrus)',
            info: '리모넨, 시트랄, 에틸 부티레이트 등이 감귤·레몬 같은 상큼함을 주며, 발효 효모의 차이 또는 진/IPA 캐스크 피니시로 강화됩니다.',
            items: ['감귤', '레몬', '오렌지 껍질'],
          },
          {
            key: 'tropical',
            label: '바나나/열대과일 (Tropical Fruity)',
            info: '이소아밀 아세테이트가 바나나·망고 향을 주며, 고온 발효나 특정 효모 사용 시 두드러집니다.',
            items: ['바나나', '망고'],
          },
          {
            key: 'dried-fruit',
            label: '건과일/다크 과일 (Dried Fruit)',
            info: '에틸 시네아메이트와 아세탈이 농축된 과일 풍미를 주며, 발효와 숙성 과정에서 산화와 농축으로 나타납니다.',
            items: ['말린 자두', '무화과'],
          },
          {
            key: 'red-fruit',
            label: '붉은 계열 과일 (Red Fruit)',
            info: '페닐에틸알코올과 벤질알코올이 체리·라즈베리 같은 붉은 과일 향을 내며, 발효 효모와 셰리 캐스크 숙성이 큰 영향을 줍니다.',
            items: ['체리', '라즈베리'],
          },
          {
            key: 'nutty',
            label: '고소한 곡물/견과향 (Nutty/Cereal)',
            info: '피라진과 퓨라놀 성분이 빵, 견과류 풍미를 만들며, 주로 킬닝 시 마이야르 반응이나 토스팅된 캐스크에서 생성됩니다.',
            items: ['곡물', '빵', '견과류'],
          },
          {
            key: 'woody',
            label: '우디/탄닌 (Woody/Tannic)',
            info: '탄닌과 쿠마린이 나무·가죽 같은 풍미를 내며, 오크통 숙성 중 리그닌·셀룰로오스 분해와 산화에 의해 형성됩니다.',
            items: ['나무', '가죽'],
          },
          {
            key: 'spicy',
            label: '스파이시 (Spicy)',
            info: '유게놀과 쿠마린이 향신료 느낌을 주며, 특히 유럽 오크 숙성 시 토스팅 강도에 따라 다양하게 변합니다.',
            items: ['시나몬', '후추'],
          },
          {
            key: 'herbal',
            label: '허브/풀향 (Herbal/Grassy)',
            info: '헥사날, 헥세놀이 신선한 풀 향을 내며, 발효 중 지방 성분이 산화될 때 주로 생성됩니다.',
            items: ['허브', '풀'],
          },
          {
            key: 'smoky',
            label: '스모키 (Smoky)',
            info: '구아이아콜, 4-메틸구아이아콜이 숯·그을음 향을 주며, 캐스크 차링이나 증류기 조건에 따라 강도가 달라집니다.',
            items: ['숯', '그을음', '재'],
          },
          {
            key: 'peaty',
            label: '피트 (Peaty)',
            info: '페놀, 크레졸, 티오페놀 등이 흙·바다·약품 같은 향을 내며, 몰트를 피트 연기로 건조할 때 흡착된 성분이 원인입니다.',
            items: ['흙', '바다', '약품'],
          },
          {
            key: 'dark-roasted',
            label: '다크/로스티드 (Dark Roasted)',
            info: '갈산, 산화 페놀 등이 다크 초콜릿·커피 풍미를 주며, 고온 킬닝과 장기 숙성에서 나타납니다.',
            items: ['다크 초콜릿', '커피', '코코아'],
          },
          {
            key: 'sulfur',
            label: '황 향 (Sulfur)',
            info: '황화수소, 디메틸설파이드(DMS) 등이 성냥불·고무 같은 향을 내며, 발효 스트레스·포트스틸 컷 미흡·셰리 캐스크 숙성에서 강화되기도 합니다. 일부는 결점이지만 개성으로 남기는 경우도 있습니다.',
            items: ['성냥불', '고무', '화약'],
          },
        ].map(group => (
          <FlavorGroupCard
            key={group.key}
            label={group.label}
            info={group.info}
            defaultOpen={group.key === 'herbal'}
          >
            {/* 펼쳤을 때 보이는 내부 UI: 타일 + (추후) 슬라이더/체크/메모 */}
            <div className="grid grid-cols-2 gap-3">
              {group.items.map(name => (
                <ItemTile key={name} label={name} />
              ))}
            </div>
          </FlavorGroupCard>
        ))}
      </section>

      {/* Comment */}
      <section className="mb-2">
        <label className="mb-1 block text-sm font-semibold text-brown-800">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={6}
          placeholder="자유롭게 시음 소감을 남겨주세요."
          className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
        />
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-brown-800">{label}</label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border-gray-300"
      />
    </div>
  );
}

function ItemTile({ label }: { label: string }) {
  return (
    <div className="rounded-md bg-white shadow-sm p-4 flex items-center justify-center">
      <span className="text-xs text-brown-700">{label}</span>
    </div>
  );
}
