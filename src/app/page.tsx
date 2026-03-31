'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { tastingNotes, communityPosts } from './mockup';
import Title from '@/components/common/Title';
import DrinkCard from '@/components/common/DrinkCard';
import { HotCommunityPostCard } from '@/components/common/HotCommunityPostCard';
import { homeHotContentQueryOptions } from '@/query/options/home';
import AuthGuard from '@/components/auth/AuthGuard';

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

function HomeContent() {
  const { data } = useQuery(homeHotContentQueryOptions);

  const hotTastingNotes = data?.hotTastingNotes?.length ? data.hotTastingNotes : tastingNotes;
  const hotCommunityPosts = data?.hotCommunityPosts?.length ? data.hotCommunityPosts : communityPosts;

  return (
    <div className="flex-1 w-full">
      <header className="w-full px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="relative w-full aspect-[16/6] min-h-[180px] max-h-[420px] overflow-hidden">
            <Image
              src="/images/main-banner.png"
              alt="Main Banner"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto my-10 flex w-full max-w-[1200px] flex-col gap-12 px-4 md:my-14 md:gap-16 md:px-6 lg:px-8">
        <section>
          <Title className="mb-5">
            <h2>Hot Tasting Note</h2>
          </Title>
          <div className="overflow-x-auto bg-grey-100 px-4 py-6 scrollbar-hide md:px-6">
            <div className="flex flex-row gap-6 w-max px-1">
              {hotTastingNotes.map(note => (
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
        <section>
          <Title className="mb-5">
            <h2>Hot Community Post</h2>
          </Title>
          <div className="bg-grey-100 px-4 py-6 md:px-6 md:py-8 lg:px-8">
            <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
              {hotCommunityPosts.map((post, index) => (
                <HotCommunityPostCard
                  key={post.id}
                  index={index}
                  title={post.title}
                  href={`/community/${post.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
