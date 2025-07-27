'use client';

import Image from 'next/image';
import { tastingNotes, communityPosts } from './mockup';
import Title from '@/components/common/Title';
import DrinkCard from '@/components/common/DrinkCard';
import { HotCommunityPostCard } from '@/components/common/HotCommunityPostCard';

export default function Home() {
  return (
    <div className="flex-1">
      <header className="relative w-full h-140">
        <Image src="/images/main-banner.png" alt="Main Banner" fill className="object-cover" />
      </header>
      <main className="flex flex-col gap-20 my-20">
        <section>
          <Title className="mx-35 mb-8">
            <h2>Hot Tasting Note</h2>
          </Title>
          <div className="overflow-x-auto py-14 pl-8 bg-gray-100 scrollbar-hide">
            <div className="flex flex-row gap-6 w-max px-1">
              {tastingNotes.map(note => (
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
          <Title className="mx-35">
            <h2>Hot Community Post</h2>
          </Title>
          <div className="bg-gray-100 px-40 py-10">
            <div className="grid grid-cols-2 gap-x-17 gap-y-2">
              {communityPosts.map((post, index) => (
                <HotCommunityPostCard
                  key={post.id}
                  index={index}
                  title={post.title}
                  href={`/community/posts/${post.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
