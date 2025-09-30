'use client';

import { useRef } from 'react';

type Props = {
  images: File[];
  onChange: (next: File[]) => void;
  max?: number; // 기본 3
};

export default function ImagePicker({ images, onChange, max = 3 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFile = () => inputRef.current?.click();

  const handlePick = (file: File | null) => {
    if (!file) return;
    if (images.length >= max) return;
    onChange([...images, file]);
  };

  const remove = (idx: number) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      {/* 가로 스크롤 갤러리 */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* 이미 추가된 썸네일들 */}
        {images.map((f, i) => (
          <div
            key={i}
            className="relative h-40 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <img
              src={URL.createObjectURL(f)}
              alt={`image-${i}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-2 top-2 rounded-full bg-white/90 px-2 text-xs shadow"
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
        ))}

        {/* + 추가 카드: 항상 1개만 표시, max 도달 시 숨김 */}
        {images.length < max && (
          <button
            type="button"
            onClick={openFile}
            className="h-40 w-[280px] flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 bg-amber-50 text-brown-700
                       flex items-center justify-center hover:border-amber-400 transition"
          >
            <div className="text-lg">＋ 이미지 추가</div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handlePick(e.target.files?.[0] ?? null)}
      />

      <p className="mt-2 text-xs text-gray-500">최대 {max}장까지 추가할 수 있어요.</p>
    </div>
  );
}
