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
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  술 이름 검색
                </label>
                <Input
                  placeholder="술 이름을 검색해주세요 (다음 단계에서 자동완성 연결)"
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

            <div className="mt-4 flex gap-3">
              <Button
                className="bg-amber-400 text-brown-900 hover:bg-amber-300"
                onClick={() => setMode('beginner')}
              >
                초심자를 위한 테이스팅 노트 작성 폼
              </Button>
              <Button
                variant="outline"
                className="border-brown-200 text-brown-700"
                onClick={() => alert('고수용 폼은 다음 단계에서 연결할게요')}
              >
                고수들을 위한 테이스팅 노트 작성 폼
              </Button>
            </div>
          </div>

          {/* 사진 자리표시자 */}
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
            <Field
              label="종류"
              value={whisky.type}
              onChange={v => setWhisky({ ...whisky, type: v })}
            />
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
            {/* 별점 */}
            <StarRating value={rating} onChange={setRating} />
          </section>

          {/* Appearance */}
          <section className="mb-8">
            <h3 className="mb-2 text-sm font-semibold text-brown-800">Appearance (외관)</h3>
            <AppearanceBar value={appearance} onChange={setAppearance} />
          </section>

          {/* Aroma / Palate / Finish 자리표시자 */}
          <section className="mb-8">
            <FlavorSelector value={flavors} onChange={setFlavors} />
          </section>
          {/* Comment: textarea 버전 */}
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

          {/* 등록 버튼 */}
          <div className="flex justify-end">
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
