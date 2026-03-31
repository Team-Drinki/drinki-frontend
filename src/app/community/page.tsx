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
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import { listPosts, type PostCategory } from '@/api/posts';

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
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('FREE');
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['community', 'posts', currentPage, selectedCategory],
    queryFn: () =>
      listPosts({
        page: currentPage,
        size: 9,
        category: selectedCategory,
        sort: 'createdAt',
      }),
    retry: false,
    throwOnError: false,
  });

  const items = useMemo(() => {
    const base = data?.items ?? [];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return base;
    return base.filter(item => item.title.toLowerCase().includes(trimmed));
  }, [data?.items, query]);
  const totalPages = data?.pageUtil?.totalPages ?? 1;

  return (
    <div>
      <BoardHeader />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <div className="flex justify-center">
          <Searchbar
            className="max-w-[726px]"
            placeholder="커뮤니티 검색"
            onSearch={nextQuery => {
              setCurrentPage(1);
              setQuery(nextQuery.trim());
            }}
          />
        </div>
        <div className="h-8 sm:h-12" />
        <div className="flex items-start justify-between gap-4 sm:items-center">
          <div className="flex flex-wrap gap-3">
            <CustomButton
              type="button"
              onClick={() => {
                setSelectedCategory('FREE');
                setCurrentPage(1);
              }}
              className={
                selectedCategory === 'FREE'
                  ? 'rounded-[8px] bg-yellow-main px-6 py-2.5 text-button text-brown'
                  : 'rounded-[8px] bg-grey-300 px-6 py-2.5 text-button text-brown'
              }
            >
              자유
            </CustomButton>
            <CustomButton
              type="button"
              onClick={() => {
                setSelectedCategory('QUESTION');
                setCurrentPage(1);
              }}
              className={
                selectedCategory === 'QUESTION'
                  ? 'rounded-[8px] bg-yellow-main px-6 py-2.5 text-button text-brown'
                  : 'rounded-[8px] bg-grey-300 px-6 py-2.5 text-button text-brown'
              }
            >
              질문
            </CustomButton>
          </div>
          <CustomButton
            onClick={() => router.push('/community/write')}
            className="flex w-fit shrink-0 flex-row items-center gap-[9px] rounded-[8px] border-2 border-brown bg-transparent px-4 py-2.5 text-brown"
          >
            <NewPost className="size-5 text-brown sm:size-6" />새 글 쓰기
          </CustomButton>
        </div>
        <div className="h-6" />

        <div className="w-full">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && <p className="text-grey-700">불러오는 중...</p>}
            {isError && <p className="text-grey-700">목록을 불러오지 못했습니다.</p>}
            {!isLoading &&
              !isError &&
              items.map(item => (
                <Link href={`/community/${item.id}`} key={item.id}>
                  <DrinkCard
                    title={item.title}
                    author={item.author?.nickname ?? 'Unknown'}
                    imageUrl={item.imageUrl ?? '/images/whisky.png'}
                    avatarUrl={item.author?.profileImageUrl ?? '/images/avatar.png'}
                    likes={item.likeCnt}
                    views={item.viewCnt}
                    comments={item.commentCnt}
                  />
                </Link>
              ))}
          </div>
        </div>

        <div className="h-12 sm:h-16" />
        <PostsPagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={setCurrentPage}
        />
        <div className="h-12 sm:h-20" />
      </main>
    </div>
  );
}
