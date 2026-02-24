'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import Searchbar from '@/components/common/Searchbar';
import { alcoholListQueryOptions } from '@/query/options/alcohol';
import AuthGuard from '@/components/auth/AuthGuard';

export default function TastingNotePage() {
  return (
    <AuthGuard>
      <TastingNotePageContent />
    </AuthGuard>
  );
}

function TastingNotePageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');

  const queryOptions = useMemo(
    () =>
      alcoholListQueryOptions({
        page: currentPage,
        size: 9,
        sort: 'TastingNote',
        query,
      }),
    [currentPage, query]
  );

  const { data, isLoading, isError } = useQuery(queryOptions);
  const items = data?.items ?? [];
  const totalPages = data?.pageUtil.totalPages ?? 1;

  return (
    <div className="flex-1">
      <div className="container mx-auto px-6 py-8">
        {/* 새글쓰기 버튼 */}
        <div className="flex justify-end mb-6">
          <Link href="/tasting-note/write" passHref>
            {/* 임시 버튼, 필요시 삭제 */}
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-brown-800 font-medium">
              <Pen className="w-4 h-4 mr-2" />
              새글쓰기
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex justify-center">
          <Searchbar
            placeholder="테이스팅 노트 검색"
            onSearch={nextQuery => {
              setCurrentPage(1);
              setQuery(nextQuery.trim());
            }}
          />
        </div>

        {isLoading && <p className="text-grey-700">불러오는 중...</p>}
        {isError && <p className="text-grey-700">목록을 불러오지 못했습니다.</p>}

        {!isLoading && !isError && (
          <div className="grid grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1 gap-5">
            {items.map(item => (
              <Link href={`/tasting-note/${item.id}`} key={item.id}>
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
        )}

        <div className="h-16" />
        <PostsPagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
