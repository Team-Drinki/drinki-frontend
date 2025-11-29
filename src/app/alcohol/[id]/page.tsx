import DrinkCard from '@/components/common/DrinkCard';
import { tastingNotes } from '@/app/mockup';
import BackButton from '@/components/common/BackButton';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import WishListButton from '@/components/buttons/WishListButton';
import Rating from '@/components/common/Rating';
import TastingNoteButton from '@/components/buttons/TastingNoteButton';
import { getAlcoholDetail } from '@/api/alcohol';
import { notFound } from 'next/navigation';

interface AlcoholDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AlcoholDetailPage({ params }: AlcoholDetailPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    notFound();
  }

  try {
    const data = await getAlcoholDetail(id);

    return (
      <main className="flex justify-center flex-col mx-32">
        <BackButton className="mt-10 mb-6">Drink</BackButton>
        {/* Alcohol Detail Section */}
        <section className="flex flex-row items-start gap-16 mb-21">
          <div className="relative w-115 h-154 bg-[var(--color-grey-100)] rounded-lg overflow-hidden">
            <Image
              src={data.image ?? '/images/whisky.png'}
              alt={data.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col h-154 flex-1">
            <div className="flex flex-row items-center mb-5">
              <span className="text-head6 text-grey-800">{data.category}</span>
              <ChevronRight className="size-8" />
              <span className="text-head6 text-grey-800">{data.style}</span>
            </div>
            <h3 className="text-head3 mb-2">{data.name}</h3>
            <div className="flex flex-row gap-[1.25rem]">
              <WishListButton alcoholId={id} initialIsWish={data.isWish} />
              <TastingNoteButton />
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-5 my-8">
              <dt className="text-head6 text-grey-900">도수</dt>
              <dd className="text-head6 text-grey-800">{data.proof}%</dd>

              <dt className="text-head6 text-grey-900">지역</dt>
              <dd className="text-head6 text-grey-800">{data.location}</dd>

              <dt className="text-head6 text-grey-900">평점</dt>
              <dd className="flex items-center gap-2.7 text-grey-800">
                <Rating rating={Number(data.rating)} />
                <span className="text-head6 ml-2">{Number(data.rating).toFixed(1)}</span>
              </dd>
            </dl>
            <dl className="flex-1">
              <dt className="text-head6 text-grey-900 mb-5">술 이야기</dt>
              <dd className="text-head6 text-grey-800 overflow-y-auto max-h-30">
                {data.description}
              </dd>
            </dl>
          </div>
        </section>
        {/* Best Tasting Notes Section */}
        <section className="flex flex-col gap-8 mb-20 ">
          <h3 className="text-head3">Best Tasting Note</h3>
          <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[var(--color-grey-100)]">
            <div className="flex justify-center gap-6 mx-34 py-14">
              {tastingNotes.slice(0, 3).map(note => (
                <DrinkCard
                  key={note.id}
                  title={note.title}
                  author={note.author}
                  imageUrl={note.imageUrl}
                  avatarUrl={note.avatarUrl}
                  likes={note.likes}
                  views={note.views}
                  comments={note.comments}
                />
              ))}
            </div>
          </div>
        </section>
        {/* Recommendations Section */}
        <section className="flex flex-col gap-8 mb-20">
          <h3 className="text-head3">Recommendations</h3>
          <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[var(--color-grey-100)]">
            <div className="flex justify-center gap-6 mx-34 py-14">
              {tastingNotes.slice(0, 3).map(note => (
                <DrinkCard
                  key={note.id}
                  title={note.title}
                  author={note.author}
                  imageUrl={note.imageUrl}
                  avatarUrl={note.avatarUrl}
                  likes={note.likes}
                  views={note.views}
                  comments={note.comments}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Failed to fetch alcohol detail data.', error);
    notFound();
  }
}
