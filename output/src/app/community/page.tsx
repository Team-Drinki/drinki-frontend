'use client';
import BoardHeader from '@/components/common/BoardHeader';
import CustomButton from '@/components/common/CustomButton';
import Searchbar from '@/components/common/Searchbar';
import NewPost from '@/components/svg/NewPost';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { alcoholListQueryOptions } from '@/query/options/alcohol';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

export default function CommunityPage() {
  return (
    <AuthGuard>
      <CommunityPageContent />
    </AuthGuard>
  );
}

function CommunityPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const queryOptions = useMemo(
    () =>
      alcoholListQueryOptions({
        page: currentPage,
        size: 9,
        sort: 'View',
        query,
      }),
    [currentPage, query]
  );

  const { data, isLoading, isError } = useQuery(queryOptions);
  const items = data?.items ?? [];
  const totalPages = data?.pageUtil.totalPages ?? 1;

  return (
    <div>
      <BoardHeader />
      <main className="pt-25 flex flex-col items-center w-full">
        <Searchbar
          placeholder="커뮤니티 검색"
          onSearch={nextQuery => {
            setCurrentPage(1);
            setQuery(nextQuery.trim());
          }}
        />
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
            {isLoading && <p className="text-grey-700">불러오는 중...</p>}
            {isError && <p className="text-grey-700">목록을 불러오지 못했습니다.</p>}
            {!isLoading &&
              !isError &&
              items.map(item => (
                <Link href={`/community/${item.id}`} key={item.id}>
                  <DrinkCard
                    title={item.name}
                    author={item.category}
                    imageUrl={item.image ?? '/images/whisky.png'}
                    avatarUrl="/images/avatar.png"
                    likes={item.wish}
                    views={item.viewCnt}
                    comments={item.noteCnt}
                  />
                </Link>
              ))}
          </div>
        </div>

        <div className="h-25" />
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
