import BackButton from '@/components/common/BackButton';
import { tastingNoteDetail } from '@/app/mockup';
import PostTitle from '@/components/common/PostTitle';
import { toAlcoholLabel } from '@/utils/alcoholTypeConvertor';
import Rating from '@/components/common/Rating';
import CommentSection from '@/components/comment/CommentSection';
import AppearanceBar from '@/components/tasting-note/AppearanceBar';
import FlavorTile from '@/components/tasting-note/FlavorTile';
import ImageGallery from '@/components/ImageGallery';
import type { FlavorItemDef, BegFlavorItemDef } from '@/components/tasting-note/FlavorGroups';
import {
  FLAVOR_GROUPS_BEGINNER,
  FLAVOR_GROUPS_EXPERT,
} from '@/components/tasting-note/FlavorGroups';

const makeBegIconMap = (items: BegFlavorItemDef[]) =>
  new Map(items.map(i => [i.name, { iconSrc: i.iconSrc, iconActiveSrc: i.iconActiveSrc }]));

const makeExpertIconMap = (groups: { items: FlavorItemDef[] }[]) => {
  const flat = groups.flatMap(g => g.items);
  return new Map(flat.map(i => [i.name, { iconSrc: i.iconSrc, iconActiveSrc: i.iconActiveSrc }]));
};

const begIconMap = makeBegIconMap(FLAVOR_GROUPS_BEGINNER);
const expertIconMap = makeExpertIconMap(FLAVOR_GROUPS_EXPERT);

export default function TastingNoteDetailPage() {
  const data = tastingNoteDetail[0];
  const iconMap = data.noteType === 'beginner' ? begIconMap : expertIconMap;
  return (
    <div className="flex flex-col gap-10 mx-30 mb-30">
      <BackButton>Tasting Note</BackButton>
      <PostTitle
        id={data.id}
        boardType={toAlcoholLabel(data.alcoholcategory)}
        title={data.title}
        proileImage={data.profileImage}
        authorNickname={data.authorNickname}
        createdAt={data.createdAt}
        views={data.views}
      />
      <div className="flex flex-col gap-9">
        {/* Image Gallery */}
        <ImageGallery images={data.content.images} />

        <dl className="flex flex-col gap-9 px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 ">
            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">이름</dt>
              <dd className="text-body1 text-black">{data.content.alchoolName}</dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">시음 날짜</dt>
              <dd className="text-body1 text-black">{data.content.tasteDate}</dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">알코올 도수</dt>
              <dd className="text-body1 text-black">{data.content.avb}도</dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">종류</dt>
              <dd className="text-body1 text-black">{toAlcoholLabel(data.alcoholcategory)}</dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">가격</dt>
              <dd className="text-body1 text-black">
                {data.content.price.toLocaleString('ko-KR')}
              </dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">지역</dt>
              <dd className="text-body1 text-black">{data.content.region}</dd>
            </div>

            <div className="flex gap-7 items-center">
              <dt className="w-30 text-head5 text-black">별점</dt>
              <dd className="text-body1 text-black">
                <Rating rating={data.content.rate} size={40} />
              </dd>
            </div>
          </div>

          {/* Appearance */}
          <dt className="text-head5 text-black">Appearance(외관)</dt>
          {data.noteType === 'beginner' ? (
            <div className="w-full">
              <AppearanceBar value={data.content.appearance} detailed={false} showLabel={false} />
            </div>
          ) : (
            <div className="w-full">
              <AppearanceBar value={data.content.appearance} detailed showLabel={false} />
            </div>
          )}

          {/* Aroma, Palate, Finish */}

          {/* DEBUG: flavor names + iconMap hit 여부 */}
          {/* <pre className="rounded-xl border bg-gray-50 p-4 text-xs text-gray-800">
            {JSON.stringify(
              {
                noteType: data.noteType,
                aroma: data.content.aroma.map((f: any) => ({
                  name: f.name,
                  value: f.value,
                  iconHit: !!iconMap.get(f.name),
                })),
                palate: data.content.palate.map((f: any) => ({
                  name: f.name,
                  value: f.value,
                  iconHit: !!iconMap.get(f.name),
                })),
                finish: data.content.finish.map((f: any) => ({
                  name: f.name,
                  value: f.value,
                  iconHit: !!iconMap.get(f.name),
                })),
              },
              null,
              2
            )}
          </pre> */}
          <div className="flex flex-col gap-3">
            <dt className="text-head5 text-black">Aroma(향)</dt>
            <dd className="flex flex-wrap gap-4">
              {data.content.aroma.map((f: { name: string; value: number }) => {
                const icons = iconMap.get(f.name);

                return (
                  <FlavorTile
                    key={f.name}
                    label={f.name}
                    score={f.value}
                    iconSrc={icons?.iconSrc}
                    iconActiveSrc={icons?.iconActiveSrc}
                    active
                    className="w-32"
                  />
                );
              })}
            </dd>
          </div>

          <div className="flex flex-col gap-3">
            <dt className="text-head5 text-black">Palate(맛)</dt>
            <dd className="flex flex-wrap gap-4">
              {data.content.palate.map((f: { name: string; value: number }) => {
                const icons = iconMap.get(f.name);
                return (
                  <FlavorTile
                    key={f.name}
                    label={f.name}
                    score={f.value}
                    iconSrc={icons?.iconSrc}
                    iconActiveSrc={icons?.iconActiveSrc}
                    active
                    className="w-32"
                  />
                );
              })}
            </dd>
          </div>

          <div className="flex flex-col gap-3">
            <dt className="text-head5 text-black">Finish(피니시)</dt>
            <dd className="flex flex-wrap gap-4">
              {data.content.finish.map((f: { name: string; value: number }) => {
                const icons = iconMap.get(f.name);
                return (
                  <FlavorTile
                    key={f.name}
                    label={f.name}
                    score={f.value}
                    iconSrc={icons?.iconSrc}
                    iconActiveSrc={icons?.iconActiveSrc}
                    active
                    className="w-32"
                  />
                );
              })}
            </dd>
          </div>
          {/* Comment */}
          <div>
            <dt className="text-head5 text-black">Comment</dt>
            <dd className="text-body1 text-black whitespace-pre-wrap">{data.content.comment}</dd>
          </div>
        </dl>

        <CommentSection postId={data.id} />
      </div>
    </div>
  );
}
