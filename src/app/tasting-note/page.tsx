'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SquarePen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DrinkCard from '@/components/common/DrinkCard';
import PostsPagination from '@/components/common/PostsPagination';
import Searchbar from '@/components/common/Searchbar';
import CustomButton from '@/components/common/CustomButton';
import { tastingNoteListQueryOptions } from '@/query/options/tasting-note';
import {
  matchesTastingNoteBoardCategory,
  type TastingNoteBoardCategory,
} from '@/lib/tasting-note-category';

const CATEGORY_BUTTONS: { label: string; value: TastingNoteBoardCategory }[] = [
  { label: '위스키', value: '위스키' },
  { label: '와인', value: '와인' },
  { label: '기타', value: '기타' },
];

export default function TastingNotePage() {
  return <TastingNotePageContent />;
}

function TastingNotePageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TastingNoteBoardCategory>('위스키');

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
  const items = useMemo(
    () =>
      (data?.notes ?? []).filter(item =>
        matchesTastingNoteBoardCategory(item.alcoholCategory, selectedCategory)
      ),
    [data?.notes, selectedCategory]
  );
  const totalPages = data?.pageUtil.totalPages ?? 1;

  return (
    <main className="flex-1 pb-20">
      <section className="px-5 pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-10">
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px]">
          <Image
            src="/images/tasting-hero-banner.png"
            alt="오늘의 한잔을 기록하세요. 술의 향과 분위기, 그리고 기억까지 남겨보세요."
            width={4320}
            height={1662}
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="h-[180px] w-full object-cover sm:h-[220px] md:h-[300px]"
          />
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
