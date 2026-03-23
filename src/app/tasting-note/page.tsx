'use client';

import Link from 'next/link';
import { SquarePen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import Searchbar from '@/components/common/Searchbar';
import AuthGuard from '@/components/auth/AuthGuard';
import CustomButton from '@/components/common/CustomButton';
import type { AlcoholLabel } from '@/constants/enum/alcoholType';
import { tastingNoteListQueryOptions } from '@/query/options/tasting-note';

type TastingNoteCategory = AlcoholLabel;

const CATEGORY_BUTTONS: { label: string; value: TastingNoteCategory }[] = [
  { label: '위스키', value: '위스키' },
  { label: '와인', value: '와인' },
  { label: '기타', value: '기타' },
];

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
  const [selectedCategory, setSelectedCategory] = useState<TastingNoteCategory>('위스키');

  const queryOptions = useMemo(
    () =>
      tastingNoteListQueryOptions({
        page: currentPage,
        size: 9,
        sort: 'createdAt',
        query,
        category: selectedCategory,
      }),
    [currentPage, query, selectedCategory]
  );

  const { data, isLoading, isError } = useQuery(queryOptions);
  const items = data?.notes ?? [];
  const totalPages = data?.pageUtil.totalPages ?? 1;

  return (
    <main className="flex-1 pb-20">
      <section className="bg-yellow-100">
        <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
          <h1 className="text-[clamp(2.25rem,9vw,3rem)] font-bold text-black">Tasting Note</h1>
          <p className="mt-3 text-body2 text-grey-800 sm:text-body1">
            향과 맛을 잊기 전에 테이스팅 노트를 작성해보세요.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pt-8 sm:px-8 sm:pt-10 md:px-10 md:pt-14">
        <div className="flex justify-center">
          <Searchbar
            className="max-w-[726px] shadow-none"
            placeholder="검색어를 입력하세요"
            onSearch={nextQuery => {
              setCurrentPage(1);
              setQuery(nextQuery.trim());
            }}
          />
        </div>

        <div className="mt-8 flex items-start justify-between gap-4 sm:mt-10 sm:items-center">
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {CATEGORY_BUTTONS.map(category => {
              const isSelected = selectedCategory === category.value;
              return (
                <CustomButton
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setCurrentPage(1);
                  }}
                  className={
                    isSelected
                      ? 'rounded-[8px] bg-yellow-main px-5 py-2 text-button text-brown hover:bg-yellow-500 sm:px-6'
                      : 'rounded-[8px] bg-grey-300 px-5 py-2 text-button text-brown hover:bg-grey-400 sm:px-6'
                  }
                >
                  {category.label}
                </CustomButton>
              );
            })}
          </div>

          <Link href="/tasting-note/write">
            <CustomButton
              className="w-fit shrink-0 rounded-[14px] border-2 border-brown bg-white px-4 py-2.5 text-body2 font-semibold text-brown hover:bg-yellow-100 sm:px-5 sm:py-3 sm:text-head6"
              icon={<SquarePen className="h-5 w-5 stroke-[2.2] sm:h-7 sm:w-7" />}
            >
              새 글 쓰기
            </CustomButton>
          </Link>
        </div>

        <div className="mt-6">
          {isLoading && <p className="text-grey-700">불러오는 중...</p>}
          {isError && <p className="text-grey-700">목록을 불러오지 못했습니다.</p>}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map(item => (
                <Link href={`/tasting-note/${item.id}`} key={item.id}>
                  <DrinkCard
                    title={item.title}
                    author={item.writer}
                    imageUrl={item.imageUrl ?? '/images/whisky.png'}
                    avatarUrl="/images/avatar.png"
                    likes={item.likeCount}
                    views={item.viewCount}
                    comments={item.commentCount}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="h-12 sm:h-16" />
        <PostsPagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
