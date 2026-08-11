'use client';

import { useEffect, useMemo, useRef } from 'react';

type Props = {
  images: File[];
  onChange: (next: File[]) => void;
  existingImages?: string[];
  onExistingImagesChange?: (next: string[]) => void;
  max?: number; // 기본 3
};

export default function ImagePicker({
  images,
  onChange,
  existingImages = [],
  onExistingImagesChange,
  max = 3,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageCount = existingImages.length + images.length;
  const previewUrls = useMemo(() => images.map(image => URL.createObjectURL(image)), [images]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(previewUrl => URL.revokeObjectURL(previewUrl));
    };
  }, [previewUrls]);

  const openFile = () => inputRef.current?.click();

  const handlePick = (file: File | null) => {
    if (!file) return;
    if (imageCount >= max) return;
    onChange([...images, file]);
  };

  const remove = (idx: number) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  const removeExisting = (idx: number) => {
    onExistingImagesChange?.(existingImages.filter((_, currentIdx) => currentIdx !== idx));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      {/* 가로 스크롤 갤러리 */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {existingImages.map((src, i) => (
          <div
            key={`existing-${i}`}
            className="relative h-40 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- URL host is provided by the API */}
            <img
              src={src}
              alt={`기존 업로드 이미지 ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeExisting(i)}
              className="absolute right-2 top-2 rounded-full bg-white/90 px-2 text-xs shadow"
              aria-label="기존 이미지 삭제"
            >
              ✕
            </button>
          </div>
        ))}

        {/* 이미 추가된 썸네일들 */}
        {images.map((file, i) => (
          <div
            key={`${file.name}-${file.lastModified}-${i}`}
            className="relative h-40 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local Blob URL preview */}
            <img
              src={previewUrls[i]}
              alt={`${file.name} 미리보기`}
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
        {imageCount < max && (
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

      <p className="mt-2 text-xs text-gray-500">
        최대 {max}장까지 추가할 수 있어요. ({imageCount}/{max})
      </p>
    </div>
  );
}
