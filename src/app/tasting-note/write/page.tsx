'use client';

import Link from 'next/link';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import ImagePicker from '@/components/tasting-note/ImagePicker';
import StarRating from '@/components/tasting-note/StarRating';
import AppearanceBar, { type AppearanceColor } from '@/components/tasting-note/AppearanceBar';
import FlavorSelector, {
  type FlavorGroupSelection,
} from '@/components/tasting-note/FlavorSelector';
import FlavorGroupCard from '@/components/tasting-note/FlavorGroupCard';
import { FLAVOR_GROUPS } from '@/components/tasting-note/FlavorGroups';
import IntensityPopover from '@/components/tasting-note/IntensityPopover';

import { Search } from 'lucide-react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type WhiskyMeta = {
  name: string;
  abv: string;
  type: string;
  price: string;
  region: string;
  date: string;
};

export default function TastingNoteWritePage() {
  const [catOpen, setCatOpen] = useState(false); // ▼/▲ 토글용
  const [images, setImages] = useState<File[]>([]);
  const [mode, setMode] = useState<'beginner' | 'expert'>('beginner');
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [boardCategory, setBoardCategory] = useState('');
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

  const [flavors, setFlavors] = useState<FlavorGroupSelection>({
    Aroma: {},
    Palate: {},
    Finish: {},
  });

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
          <div className="bg-[#FFECA9] border border-[#FFECA9] p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-12 gap-4">
              {/* 드롭다운 (게시판 주제 선택) */}
              <div className="col-span-12">
                <Select
                  value={boardCategory || undefined}
                  onValueChange={v => setBoardCategory(v)}
                  onOpenChange={setCatOpen}
                >
                  <SelectTrigger
                    className="
                      w-auto
                      h-6
                      bg-transparent
                      border-0
                      border-b-2 border-[#402002]
                      rounded-none
                      shadow-none
                      px-0
                      text-brown-900 font-semibold
                      justify-start
                      focus:ring-0 focus:outline-none focus-visible:ring-0
                      [&>svg]:hidden   /* shadcn 기본 chevron 숨기기 */
                    "
                  >
                    <span className="flex items-center gap-2">
                      <SelectValue placeholder="게시판 주제 선택" />
                      <span className="text-[#402002] text-sm leading-none">
                        {catOpen ? '▲' : '▼'}
                      </span>
                    </span>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="위스키">위스키</SelectItem>
                    <SelectItem value="와인">와인</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 술 이름 검색 */}
              <div className="col-span-12 md:col-span-9">
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  술 이름 검색
                </label>
                <div className="relative">
                  <Input
                    placeholder="술 이름을 검색해주세요 (아직 미구현)"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full bg-white border-brown-200 focus:border-brown-400 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-700" />
                </div>
              </div>

              {/* 제목: 전체폭 */}
              <div className="col-span-12">
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
  setFlavors: Dispatch<SetStateAction<FlavorGroupSelection>>;
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
  setFlavors: Dispatch<SetStateAction<FlavorGroupSelection>>;
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
  const [tab, setTab] = useState<'Aroma' | 'Palate' | 'Finish'>('Aroma');

  const setScoreOnCurrentTab = (label: string, score: number) => {
    setFlavors((prev: FlavorGroupSelection) => {
      const next = { ...prev, [tab]: { ...(prev[tab] || {}) } };
      if (score <= 0) delete next[tab][label];
      else next[tab][label] = score;
      return next;
    });
  };

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

      {/*Aroma, Palate, Finish button*/}
      <div className="mb-3 flex gap-2">
        {(['Aroma', 'Palate', 'Finish'] as const).map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1 text-sm transition
                ${
                  active
                    ? 'bg-amber-400 text-[#653205] font-semibold'
                    : 'bg-white text-[#653205] border border-brown-200 font-semibold'
                }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* 세부 향미 그룹 (드롭다운 카드) 왼쪽 오른쪽 나누어 독립적으로 작용 */}
      {/* 왼쪽 컬럼 */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {FLAVOR_GROUPS.filter((_, i) => i % 2 === 0).map(group => (
            <FlavorGroupCard key={group.key} label={group.label} info={group.info}>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map(name => (
                  <ExpertFlavorItem
                    key={name}
                    label={name}
                    score={flavors[tab]?.[name] ?? 0}
                    onChange={(s: number) => setScoreOnCurrentTab(name, s)}
                  />
                ))}
              </div>
            </FlavorGroupCard>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {FLAVOR_GROUPS.filter((_, i) => i % 2 === 1).map(group => (
            <FlavorGroupCard key={group.key} label={group.label} info={group.info}>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map(name => (
                  <ExpertFlavorItem
                    key={name}
                    label={name}
                    score={flavors[tab]?.[name] ?? 0}
                    onChange={(s: number) => setScoreOnCurrentTab(name, s)}
                  />
                ))}
              </div>
            </FlavorGroupCard>
          ))}
        </div>
      </section>

      {/* Comment */}
      <section className="mb-2 mt-2">
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

function ExpertFlavorItem({
  label,
  score,
  onChange,
}: {
  label: string;
  score: number; // 0~5
  onChange: (s: number) => void;
}) {
  // 선택 상태에 따른 스타일
  const isActive = score > 0;
  const baseClass =
    'relative flex items-center justify-center rounded-md border shadow-sm p-3 text-xs transition select-none';
  const stateClass = isActive
    ? 'border-[#402002]'
    : 'bg-white border-brown-200 hover:border-amber-400';

  // 클릭 시 토글(선택 기본값 2.5)
  const toggle = () => onChange(isActive ? 0 : 2.5);

  const Tile = (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      className={`${baseClass} ${stateClass}`}
      style={{
        backgroundColor: isActive ? '#FFD445' : undefined,
        boxShadow: isActive ? 'inset 0 0 0 2px #402002' : undefined,
      }}
    >
      <span className="text-brown-800">{label}</span>

      {isActive && (
        <>
          <span className="absolute bottom-1 left-1 rounded-md bg-white/95 px-1.5 text-[10px] font-semibold">
            {score.toFixed(1)}
          </span>
          <button
            type="button"
            className="absolute right-1 top-1 rounded-full bg-white/90 px-1 text-[10px] shadow"
            onClick={e => {
              e.stopPropagation(); // 부모 토글/아코디언 방지
              onChange(0);
            }}
            aria-label="remove"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );

  // IntensityPopover 적용 (asChild로 타일 자체를 트리거로)
  return (
    <IntensityPopover
      label={`${label} 강도 조절`}
      value={score}
      onChange={v => onChange(Math.max(0, Math.min(5, v)))}
      width={240}
      asChild
    >
      {Tile}
    </IntensityPopover>
  );
}
