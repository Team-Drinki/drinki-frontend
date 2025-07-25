'use client';

import Image from 'next/image';
import { Heart, Eye, MessageSquare, ChevronRight } from 'lucide-react';
import { tastingNotes, communityPosts } from './mockup';
import Title from '@/components/common/Title';
import DrinkCard from '@/components/common/DrinkCard';

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
          <div className="overflow-x-auto py-14 bg-gray-100 scrollbar-hide">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            {communityPosts.map((post, index) => (
              <div
                key={post.id}
                className={`flex items-start gap-2 p-3 rounded-md border ${
                  index === 0 ? 'bg-yellow-300 text-black font-semibold' : 'bg-gray-50'
                }`}
              >
                <span className="font-bold">{index + 1}</span>
                <p>{post.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
