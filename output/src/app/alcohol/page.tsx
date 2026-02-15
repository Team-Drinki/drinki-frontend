'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import Searchbar from '@/components/common/Searchbar';
import { alcoholListQueryOptions } from '@/query/options/alcohol';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AlcoholPage() {
  return (
    <AuthGuard>
      <AlcoholPageContent />
    </AuthGuard>
  );
}

function AlcoholPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');

  const queryOptions = useMemo(
    () =>
      alcoholListQueryOptions({
        page: currentPage,
        size: 9,
        sort: 'CreatedAt',
        query,
      }),
    [currentPage, query]
  );

  const { data, isLoading, isError } = useQuery(queryOptions);
  const items = data?.items ?? [];
  const totalPages = data?.pageUtil.totalPages ?? 1;

  return (
    <main className="pt-25 flex flex-col items-center w-full">
      <Searchbar
        placeholder="술 이름을 검색하세요"
        onSearch={nextQuery => {
          setCurrentPage(1);
          setQuery(nextQuery.trim());
        }}
      />
      <div className="h-8" />

      {isLoading && <p className="text-grey-700">불러오는 중...</p>}
      {isError && <p className="text-grey-700">목록을 불러오지 못했습니다.</p>}

      {!isLoading && !isError && (
        <div className="flex justify-start w-full px-[124px]">
          <div className="grid grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1 gap-5">
            {items.map(item => (
              <Link href={`/alcohol/${item.id}`} key={item.id}>
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
      )}

      <div className="h-20" />
      <PostsPagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)}
        onPageChange={setCurrentPage}
      />
      <div className="h-20" />
    </main>
  );
}
