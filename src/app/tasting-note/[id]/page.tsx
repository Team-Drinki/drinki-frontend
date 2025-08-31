import BackButton from '@/components/common/BackButton';
import { tastingNoteDetail } from '@/app/mockup';
import PostTitle from '@/components/common/PostTitle';
import { toAlcoholLabel } from '@/utils/alcoholTypeConvertor';
import Image from 'next/image';
import Rating from '@/components/common/Rating';
import CommentSection from '@/components/comment/CommentSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

export default function TastingNoteDetailPage() {
  const data = tastingNoteDetail[0];
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
        <Carousel className="w-full">
          <CarouselContent>
            {data.content.images.map((image, index) => (
              <CarouselItem key={index} className="relative md:basis-1/2 lg:basis-1/3">
                <div className="h-100 relative">
                  <Image src={image} alt={`tasting-note-${index}`} fill className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {data.content.images?.length > 3 && (
            <>
              <CarouselPrevious className="-left-10" />
              <CarouselNext className="-right-10" />
            </>
          )}
        </Carousel>

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

          <dt className="text-head5 text-black">Appearance(외관)</dt>
          <dt className="text-head5 text-black">Aroma(향)</dt>
          <dt className="text-head5 text-black">Palate(맛)</dt>
          <dt className="text-head5 text-black">Finish(피니시)</dt>
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
