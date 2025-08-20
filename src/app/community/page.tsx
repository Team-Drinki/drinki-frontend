'use client';
import BoardHeader from '@/components/common/BoardHeader';
import CustomButton from '@/components/common/CustomButton';
import Searchbar from '@/components/common/Searchbar';
import NewPost from '@/components/svg/NewPost';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const router = useRouter();

  const mockDrinks = Array.from({ length: 9 }, (_, i) => ({
    title: `위스키 ${i + 1}에 대한 이야기`,
    author: `사용자${i + 1}`,
    imageUrl: '/images/whisky.png',
    avatarUrl: '/images/avatar.png',
    likes: Math.floor(Math.random() * 100) + 10,
    views: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 50) + 5,
  }));

  return (
    <div>
      <BoardHeader />
      <main className="pt-25 flex flex-col items-center w-full">
        <Searchbar />
        <div className="h-16" />
        <div className="flex flex-row justify-between w-full px-[124px]">
          <div className="flex flex-row gap-3">
            <CustomButton className="bg-grey-300 text-button text-brown rounded-[8px] px-[31px] py-[11.5px]">
              자유
            </CustomButton>
            <CustomButton className="bg-yellow-main text-button text-brown rounded-[8px] px-[31px] py-[11.5px]">
              질문
            </CustomButton>
          </div>
          <CustomButton
            onClick={() => router.push('/community/write')}
            className="flex border-2 border-brown text-brown rounded-[8px] bg-transparent flex-row items-center py-2.5 px-4.5 gap-[9px]"
          >
            <NewPost className="size-6 text-brown" />새 글 쓰기
          </CustomButton>
        </div>
        <div className="h-6" />

        <div className="flex justify-start w-full px-[124px]">
          <div className="grid grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1 gap-5">
            {mockDrinks.map((drink, index) => (
              <DrinkCard
                key={index}
                title={drink.title}
                author={drink.author}
                imageUrl={drink.imageUrl}
                avatarUrl={drink.avatarUrl}
                likes={drink.likes}
                views={drink.views}
                comments={drink.comments}
              />
            ))}
          </div>
        </div>

        <div className="h-25" />

        {/* PostsPagination */}
        <PostsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className="h-[293px]" />
      </main>
    </div>
  );
}
