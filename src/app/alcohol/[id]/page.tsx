import DrinkCard from '@/components/common/DrinkCard';
import { tastingNotes } from '@/app/mockup';
import BackButton from '@/components/common/BackButton';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import WishListButton from '@/components/buttons/WishListButton';
import Rating from '@/components/common/Rating';
import { alcohols } from '@/app/mockup';

export default function AlcoholDetailPage() {
  const { name, imageUrl, lgCategory, smCategory, region, abv, volume, distillery, rating } =
    alcohols[0];
  return (
    <main className="flex justify-center flex-col mx-32">
      <BackButton className="mt-10 mb-6">Drink</BackButton>
      {/* Alcohol Detail Section */}
      <section className="flex flex-row items-start gap-16 mb-21">
        <div className="relative w-115 h-154 bg-[var(--color-grey-100)] rounded-lg overflow-hidden">
          <Image src={imageUrl} alt="Whisky" fill className="object-contain" />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-5">
            <span className="text-head6 text-gray-800">{lgCategory}</span>
            <ChevronRight className="size-8" />
            <span className="text-head6 text-gray-800">{smCategory}</span>
          </div>
          <h3 className="text-head3 mb-2">{name}</h3>
          <WishListButton />
          <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-5 mt-8 mb-21">
            <dt className="text-head6 text-gray-900">용량</dt>
            <dd className="text-head6 text-gray-800">{volume}</dd>

            <dt className="text-head6 text-gray-900">도수</dt>
            <dd className="text-head6 text-gray-800">{abv}%</dd>

            <dt className="text-head6 text-gray-900">지역</dt>
            <dd className="text-head6 text-gray-800">{region}</dd>

            <dt className="text-head6 text-gray-900">증류소</dt>
            <dd className="text-head6 text-gray-800">{distillery}</dd>

            <dt className="text-head6 text-gray-900">평점</dt>
            <dd className="flex items-center gap-2.7 text-gray-800">
              <Rating rating={rating} />
              <span className="text-head6 ml-2">{rating}</span>
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
}
