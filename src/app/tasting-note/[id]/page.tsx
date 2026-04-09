'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/common/BackButton';
import CustomTooltip from '@/components/common/CustomTooltip';
import Rating from '@/components/common/Rating';
import AppearanceBar, { type AppearanceColor } from '@/components/tasting-note/AppearanceBar';
import FlavorTile from '@/components/tasting-note/FlavorTile';
import TastingNoteCommentSection from '@/components/tasting-note/TastingNoteCommentSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authQueryOptions } from '@/query/options/auth';
import { tastingNoteDetailQueryOptions } from '@/query/options/tasting-note';
import {
  FLAVOR_GROUPS_BEGINNER,
  FLAVOR_GROUPS_EXPERT,
  type BegFlavorItemDef,
  type FlavorItemDef,
} from '@/components/tasting-note/FlavorGroups';
import { deleteTastingNote } from '@/api/tasting-note';
import { flattenRatingMapToTiles } from '@/lib/tasting-note';
import { tastingNoteDetail as tastingNoteDetailMock } from '@/app/mockup';

const makeBegIconMap = (items: BegFlavorItemDef[]) =>
  new Map(items.map(item => [item.name, { iconSrc: item.iconSrc, iconActiveSrc: item.iconActiveSrc }]));

const makeExpertIconMap = (groups: { items: FlavorItemDef[] }[]) => {
  const flat = groups.flatMap(group => group.items);
  return new Map(flat.map(item => [item.name, { iconSrc: item.iconSrc, iconActiveSrc: item.iconActiveSrc }]));
};

const iconMap = new Map([...makeBegIconMap(FLAVOR_GROUPS_BEGINNER), ...makeExpertIconMap(FLAVOR_GROUPS_EXPERT)]);

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function buildFallbackName(title: string) {
  const normalized = title.trim();
  if (!normalized) {
    return 'Tasting Note';
  }

  return normalized.replace(/\s+(첫 시음|시음기|후기|리뷰)$/u, '');
}

function formatPrice(value: number | string) {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat('ko-KR').format(amount);
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3">
      <dt className="text-sm font-semibold text-[#7e6b5a]">{label}</dt>
      <dd className="text-sm text-[#2d241d]">{value}</dd>
    </div>
  );
}

function VisualSpectrum({
  value,
  detailed = false,
}: {
  value: AppearanceColor | null;
  detailed?: boolean;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#241a13]">Appearance</h2>
      </div>
      <AppearanceBar value={value} detailed={detailed} className="max-w-none" />
    </section>
  );
}

function FlavorSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; score: number }>;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#241a13]">{title}</h2>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {items.map(item => {
            const icons = iconMap.get(item.label);
            return (
              <FlavorTile
                key={`${title}-${item.label}`}
                label={item.label}
                score={item.score}
                iconSrc={icons?.iconSrc}
                iconActiveSrc={icons?.iconActiveSrc}
                active
                className="w-[6.5rem] sm:w-28"
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d7c8b6] bg-[#fcf8f2] px-4 py-6 text-sm text-[#8f7d6d]">
          아직 기록된 향미가 없습니다.
        </div>
      )}
    </section>
  );
}

export default function TastingNoteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const noteId = Number(params?.id);
  const queryClient = useQueryClient();

  const { data: currentUserId } = useQuery(authQueryOptions);
  const { data, isLoading, isError } = useQuery(tastingNoteDetailQueryOptions(noteId));
  const isOwner = currentUserId === data?.writerId;

  const aromaItems = useMemo(() => (data ? flattenRatingMapToTiles(data.aromaNote) : []), [data]);
  const palateItems = useMemo(() => (data ? flattenRatingMapToTiles(data.palateNote) : []), [data]);
  const finishItems = useMemo(() => (data ? flattenRatingMapToTiles(data.finishNote) : []), [data]);
  const allFlavorItems = useMemo(() => [...aromaItems, ...palateItems, ...finishItems], [aromaItems, palateItems, finishItems]);
  const topFlavors = useMemo(() => [...allFlavorItems].sort((a, b) => b.score - a.score).slice(0, 3), [allFlavorItems]);

  const imageList = useMemo(() => {
    const filtered = data?.images.filter(image => image.trim().length > 0) ?? [];
    return filtered.length > 0 ? filtered : ['/images/whisky.png'];
  }, [data?.images]);

  const previewImages = imageList.slice(0, 3);
  const mockDetail = tastingNoteDetailMock.find(item => item.id === String(noteId)) ?? tastingNoteDetailMock[0];
  const isExpertAppearance = mockDetail?.noteType === 'expert';

  const deleteMutation = useMutation({
    mutationFn: () => deleteTastingNote(noteId),
    onSuccess: async () => {
      toast.success('테이스팅 노트를 삭제했어요.', { duration: 1200 });
      await queryClient.invalidateQueries({ queryKey: ['tasting-note'] });
      router.replace('/tasting-note');
    },
    onError: error => {
      const message = error instanceof Error ? error.message : '삭제에 실패했어요.';
      toast.error(message, { duration: 1500 });
    },
  });

  const handleDelete = async () => {
    if (!isOwner || deleteMutation.isPending) {
      return;
    }

    const confirmed = window.confirm('이 테이스팅 노트를 삭제할까요?');
    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync();
  };

  if (!Number.isFinite(noteId) || noteId <= 0) {
    return <div className="mx-auto max-w-5xl px-6 py-10 text-body1 text-red-600">잘못된 노트 경로입니다.</div>;
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

  const tastingName = buildFallbackName(data.title);
  const detailInfo = {
    whiskyName: mockDetail?.content.alchoolName ?? tastingName,
    tastingDate: mockDetail?.content.tasteDate ?? formatShortDate(data.createdAt),
    abv: mockDetail?.content.avb ? `${mockDetail.content.avb}도` : '-',
    type: mockDetail?.content.type ?? '위스키',
    price: mockDetail?.content.price ? formatPrice(mockDetail.content.price) : '-',
    region: mockDetail?.content.region ?? '-',
    rating: mockDetail?.content.rate ?? 0,
    appearance: (mockDetail?.content.appearance ?? 'gold') as AppearanceColor,
  };
  const tastingContext = '본문 자리';
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 pb-20 pt-7 sm:px-8 lg:px-10">
      <BackButton className="-ml-2 text-[#2d241d]">Tasting Note</BackButton>

      <section className="px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
        <div className="flex flex-col gap-6 border-b border-[#efe5d9] pb-6">
          <div className="flex flex-col gap-5">
            <div className="space-y-4">
              <h1 className="max-w-4xl text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.2] text-[#241a13]">
                {data.title}
              </h1>

              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border border-[#eadfce]">
                    <AvatarImage src={data.writerImage ?? undefined} />
                    <AvatarFallback>{data.writerName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xl font-semibold text-[#241a13]">{data.writerName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#241a13]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">작성</span>
                    <span>{formatShortDate(data.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">조회수</span>
                    <span>{formatCompactNumber(data.viewCount)}</span>
                  </div>
                  <CustomTooltip
                    trigger={<EllipsisVertical className="h-5 w-5 text-[#653205]" />}
                    options={
                      isOwner
                        ? [
                            {
                              key: 'edit',
                              label: '수정',
                              onSelect: () => {
                                router.push(`/tasting-note/edit?noteId=${data.id}`);
                              },
                            },
                            {
                              key: 'delete',
                              label: deleteMutation.isPending ? '삭제 중...' : '삭제',
                              onSelect: () => {
                                if (!deleteMutation.isPending) {
                                  void handleDelete();
                                }
                              },
                            },
                          ]
                        : [
                            {
                              key: 'report',
                              label: '신고',
                              onSelect: () => {
                                toast.info('신고 기능은 준비 중이에요.', { duration: 1500 });
                              },
                            },
                          ]
                    }
                    contentClassName="rounded-xl px-0 py-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-7">
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {previewImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-[#f4ece0]"
                >
                  <Image
                    src={image}
                    alt={`${data.title}-${index + 1}`}
                    fill
                    unoptimized={/^https?:\/\//.test(image)}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {imageList.length > previewImages.length && (
              <p className="text-sm text-[#8f7d6d]">이미지 {imageList.length}장 중 일부를 미리 보여주고 있습니다.</p>
            )}
          </section>

          <section className="px-0 py-0">
            <div>
              <dl className="grid gap-x-8 sm:grid-cols-2">
                <InfoRow label="위스키 이름" value={detailInfo.whiskyName} />
                <InfoRow label="시음 날짜" value={detailInfo.tastingDate} />
                <InfoRow label="알코올 도수" value={detailInfo.abv} />
                <InfoRow label="종류" value={detailInfo.type} />
                <InfoRow label="가격" value={detailInfo.price} />
                <InfoRow label="지역" value={detailInfo.region} />
              </dl>

              <div className="mt-4 grid grid-cols-[5.5rem_1fr] items-center gap-3 py-2">
                <span className="text-sm font-semibold text-[#7e6b5a]">별점</span>
                <Rating rating={detailInfo.rating} size={24} />
              </div>
            </div>

            <div className="mt-7 pt-6">
              <VisualSpectrum value={detailInfo.appearance} detailed={isExpertAppearance} />
            </div>
          </section>

          <section className="px-0 py-0">
            <div className="space-y-8">
              <FlavorSection title="Aroma" items={aromaItems} />
              <FlavorSection title="Palate" items={palateItems} />
              <FlavorSection title="Finish" items={finishItems} />
            </div>
          </section>

          <section className="px-0 py-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#241a13]">Comment</h2>
            </div>

            <div className="rounded-[20px] py-5 text-sm leading-7 text-[#47392d]">
              <p className="whitespace-pre-wrap">{tastingContext}</p>
            </div>
          </section>

          <TastingNoteCommentSection
            noteId={data.id}
            currentUserId={currentUserId}
            comments={data.comments}
            likeCount={data.likeCount}
            isLikeActive={data.likeCount > 0}
          />
        </div>
      </section>
    </main>
  );
}
