'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import FlavorSelector, {
  type FlavorGroupSelection,
} from '@/components/tasting-note/FlavorSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTastingNote, updateTastingNote } from '@/api/tasting-note';
import { fromTastingNoteDetail, toTastingNotePayload, filesToDataUrls } from '@/lib/tasting-note';
import { tastingNoteDetailQueryOptions } from '@/query/options/tasting-note';

export default function TastingNoteEditPage() {
  return (
    <AuthGuard>
      <TastingNoteEditPageContent />
    </AuthGuard>
  );
}

function TastingNoteEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const noteId = Number(searchParams.get('noteId') ?? searchParams.get('id'));

  const [title, setTitle] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [flavors, setFlavors] = useState<FlavorGroupSelection>({
    Aroma: {},
    Palate: {},
    Finish: {},
  });
  const [initialized, setInitialized] = useState(false);

  const { data, isLoading, isError } = useQuery({
    ...tastingNoteDetailQueryOptions(noteId),
    queryFn: () => getTastingNote(noteId),
  });

  useEffect(() => {
    if (!data || initialized) {
      return;
    }

    setTitle(data.title);
    setExistingImages(data.images);
    setNewImages([]);
    setFlavors(fromTastingNoteDetail(data));
    setInitialized(true);
  }, [data, initialized]);

  const totalSelectedFlavorCount = useMemo(
    () =>
      Object.keys(flavors.Aroma).length +
      Object.keys(flavors.Palate).length +
      Object.keys(flavors.Finish).length,
    [flavors]
  );

  const updateMutation = useMutation({
    mutationFn: async () => {
      const uploadedImages = await filesToDataUrls(newImages);
      return updateTastingNote(noteId, {
        title: title.trim(),
        ...toTastingNotePayload(flavors),
        images: [...existingImages, ...uploadedImages],
      });
    },
    onSuccess: async () => {
      toast.success('테이스팅 노트를 수정했어요.', { duration: 1200 });
      await queryClient.invalidateQueries({ queryKey: ['tasting-note'] });
      router.push(`/tasting-note/${noteId}`);
    },
    onError: error => {
      const message = error instanceof Error ? error.message : '수정 중 문제가 발생했어요.';
      toast.error(message, { duration: 1500 });
    },
  });

  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const remainingCount = 3 - existingImages.length - newImages.length;
    if (remainingCount <= 0) {
      toast.info('이미지는 최대 3장까지 등록할 수 있어요.', { duration: 1200 });
      return;
    }

    const accepted = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, remainingCount);

    if (accepted.length === 0) {
      toast.info('이미지 파일만 선택할 수 있어요.', { duration: 1200 });
      return;
    }

    setNewImages(prev => [...prev, ...accepted]);
  };

  const handleSubmit = async () => {
    if (!Number.isFinite(noteId) || noteId <= 0) {
      toast.error('잘못된 노트 경로입니다.', { duration: 1200 });
      return;
    }

    if (!title.trim()) {
      toast.info('제목을 입력해주세요.', { duration: 1200 });
      return;
    }

    if (totalSelectedFlavorCount === 0) {
      toast.info('최소 한 개 이상의 향미를 선택해주세요.', { duration: 1200 });
      return;
    }

    await updateMutation.mutateAsync();
  };

  if (!Number.isFinite(noteId) || noteId <= 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-red-600">
        noteId가 없습니다. `/tasting-note/edit?noteId=123` 형태로 접근해주세요.
      </div>
    );
  }

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-grey-700">불러오는 중...</div>;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-grey-700">
        테이스팅 노트를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:px-8">
      <Link
        href={`/tasting-note/${noteId}`}
        className="inline-flex items-center text-brown-800 transition-colors hover:text-brown-600"
      >
        <ChevronLeft className="mr-1 h-5 w-5" />
        <span className="text-head6 font-medium">Tasting Note</span>
      </Link>

      <section className="rounded-2xl border border-grey-300 bg-white px-6 py-7 shadow-sm">
        <h1 className="text-head4 text-black">테이스팅 노트 수정</h1>
        <p className="mt-2 text-body3 text-grey-700">
          백엔드에서 지원하는 제목, 이미지, 향미 정보만 수정할 수 있어요.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-brown-800">제목</label>
          <Input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="제목을 입력해주세요"
            className="w-full bg-white"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-grey-300 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-head5 text-black">이미지</h2>
          <span className="text-body3 text-grey-700">
            {existingImages.length + newImages.length}/3
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {existingImages.map((image, index) => (
            <div
              key={`existing-${index}`}
              className="relative h-40 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img src={image} alt={`existing-image-${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setExistingImages(prev => prev.filter((_, current) => current !== index))}
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 text-xs shadow"
                aria-label="기존 이미지 삭제"
              >
                ✕
              </button>
            </div>
          ))}

          {newImages.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative h-40 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`new-image-${index}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setNewImages(prev => prev.filter((_, current) => current !== index))}
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 text-xs shadow"
                aria-label="새 이미지 삭제"
              >
                ✕
              </button>
            </div>
          ))}

          {existingImages.length + newImages.length < 3 && (
            <label className="flex h-40 w-[280px] flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-amber-50 text-brown-700 transition hover:border-amber-400">
              <span className="text-lg">＋ 이미지 추가</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={event => {
                  handleAddImages(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">기존 이미지는 삭제할 수 있고, 새 이미지는 최대 3장까지 추가할 수 있어요.</p>
      </section>

      <section className="rounded-2xl border border-grey-300 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-head5 text-black">향미 선택</h2>
          <span className="text-body3 text-grey-700">{totalSelectedFlavorCount}개 선택됨</span>
        </div>
        <FlavorSelector value={flavors} onChange={setFlavors} />
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push(`/tasting-note/${noteId}`)}>
          취소
        </Button>
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={updateMutation.isPending}
          className="bg-yellow-main text-black hover:bg-yellow-500"
        >
          {updateMutation.isPending ? '저장 중...' : '수정 저장'}
        </Button>
      </div>
    </main>
  );
}
