'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authQueryOptions } from '@/query/options/auth';
import { wishAlcoholListQueryOptions } from '@/query/options/alcohol';
import { logout } from '@/api/auth';
import AuthGuard from '@/components/auth/AuthGuard';
import ProfileSidebarCard from '@/components/profile/ProfileSidebarCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { myProfileQueryOptions } from '@/query/options/user';
import { ChevronRight, Eye, Heart, MessageSquare } from 'lucide-react';

type ActivityItem = {
  id: number | string;
  title: string;
  author: string;
  imageUrl: string;
  likes: number;
  views: number;
  comments: number;
  href: string;
};

type CommentItem = {
  id: number;
  postTitle: string;
  comment: string;
};

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}

function MyPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useQuery(authQueryOptions);
  const { data: profile, isLoading: isProfileLoading } = useQuery(myProfileQueryOptions);
  const {
    data: wishes,
    isLoading: isWishLoading,
  } = useQuery(wishAlcoholListQueryOptions(1, 9));

  const tastingNoteItems: ActivityItem[] = [
    {
      id: 1,
      title: '발렌타인 30년 블렌디드 스카치 위스키',
      author: '닉네임',
      imageUrl: '/images/whisky.png',
      likes: 459,
      views: 2025,
      comments: 72,
      href: '/tasting-note/1',
    },
    {
      id: 2,
      title: '맥캘란 18년 첫 시음 기록',
      author: '닉네임',
      imageUrl: '/images/whisky.png',
      likes: 317,
      views: 1284,
      comments: 48,
      href: '/tasting-note/2',
    },
  ];

  const communityItems: ActivityItem[] = [
    {
      id: 11,
      title: '입문자를 위한 위스키 추천 5선',
      author: '닉네임',
      imageUrl: '/images/whisky.png',
      likes: 201,
      views: 1740,
      comments: 36,
      href: '/community/11',
    },
    {
      id: 12,
      title: '요즘 빠진 조합: 아벨라워 + 다크초콜릿',
      author: '닉네임',
      imageUrl: '/images/whisky.png',
      likes: 158,
      views: 1133,
      comments: 22,
      href: '/community/12',
    },
  ];

  const wishlistItems: ActivityItem[] =
    wishes?.items.slice(0, 2).map(item => ({
      id: item.id,
      title: item.name,
      author: item.category,
      imageUrl: item.image ?? '/images/whisky.png',
      likes: item.wish,
      views: item.viewCnt,
      comments: item.noteCnt,
      href: `/alcohol/${item.id}`,
    })) ?? [];

  const fallbackWishlistItems: ActivityItem[] = [
    {
      id: 21,
      title: '글렌피딕 15년 솔레라',
      author: '위스키',
      imageUrl: '/images/whisky.png',
      likes: 98,
      views: 902,
      comments: 19,
      href: '/alcohol/21',
    },
    {
      id: 22,
      title: '달모어 12년',
      author: '위스키',
      imageUrl: '/images/whisky.png',
      likes: 76,
      views: 740,
      comments: 14,
      href: '/alcohol/22',
    },
  ];

  const commentItems: CommentItem[] = [
    {
      id: 1,
      postTitle: '입문자를 위한 위스키 추천 5선',
      comment: ' 저는 글렌리벳 12년도 정말 추천해요.',
    },
    {
      id: 2,
      postTitle: '요즘 빠진 조합: 아벨라워 + 다크초콜릿',
      comment: ' 이 조합 진짜 공감입니다. 피트향에도 잘 어울려요.',
    },
    {
      id: 3,
      postTitle: '테이스팅노트 어떻게 쓰고 계신가요?',
      comment: ' 향/맛/피니시를 나눠서 쓰니 훨씬 정리되더라고요.',
    },
  ];

  const handleLogout = async () => {
    await logout();
    // 임시: 로그아웃 시 인증 캐시 삭제
    queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    queryClient.removeQueries({ queryKey: myProfileQueryOptions.queryKey });
    router.replace('/login');
  };

  return (
    <main className="bg-grey-100 min-h-[calc(100vh-8rem)] px-4 py-6 md:px-8 md:py-10 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-5 text-[clamp(2rem,8vw,2.5rem)] font-bold leading-[1.2] text-dark-brown md:mb-8">
          마이페이지
        </h1>

        <div className="grid grid-cols-1 items-start gap-4 md:gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <ProfileSidebarCard variant="me" profile={profile} isLoading={isProfileLoading} />
            <Card className="rounded-2xl border-none shadow-sm">
              <CardContent className="p-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-5">
            <DashboardSection title="Tasting Note" moreHref="/tasting-note">
              <ActivityGrid items={tastingNoteItems} />
            </DashboardSection>

            <DashboardSection title="Community Post" moreHref="/community">
              <ActivityGrid items={communityItems} />
            </DashboardSection>

            <DashboardSection title="Wishlist" moreHref="/alcohol">
              {isWishLoading ? (
                <p className="text-body3 text-grey-700">위시리스트를 불러오는 중...</p>
              ) : (
                <ActivityGrid items={wishlistItems.length > 0 ? wishlistItems : fallbackWishlistItems} />
              )}
            </DashboardSection>

            <DashboardSection title="Comments" moreHref="/community">
              <CommentList items={commentItems} />
            </DashboardSection>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardSection({
  title,
  moreHref,
  children,
}: {
  title: string;
  moreHref: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-none py-0 shadow-sm">
      <div className="flex items-center justify-between bg-yellow-main px-4 py-3 md:px-5">
        <h2 className="text-[1.55rem] font-semibold leading-[1.2] text-black md:text-head6">{title}</h2>
        <Link
          href={moreHref}
          className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-black md:text-body3"
        >
          more <ChevronRight className="size-4" />
        </Link>
      </div>
      <CardContent className="px-3.5 pb-3.5 pt-0 md:px-5 md:pb-5 md:pt-0">{children}</CardContent>
    </Card>
  );
}

function ActivityGrid({ items }: { items: ActivityItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 md:gap-4 lg:grid-cols-2">
      {items.slice(0, 2).map(item => (
        <Link href={item.href} key={item.id}>
          <article className="rounded-xl overflow-hidden border border-grey-200 bg-white hover:shadow-sm transition-shadow">
            <div className="relative h-32 bg-grey-100 md:h-36">
              <Image
                src={item.imageUrl || '/images/whisky.png'}
                alt={item.title}
                fill
                unoptimized={/^https?:\/\//.test(item.imageUrl || '')}
                className="object-cover"
              />
              <Badge className="absolute right-2 top-2 bg-yellow-main text-black hover:bg-yellow-main">
                <Heart className="mr-1 size-3.5 fill-black stroke-black" />
                {item.likes}
              </Badge>
            </div>
            <div className="px-3.5 py-2.5 md:px-4 md:py-3">
              <h3 className="text-body2 font-semibold text-black truncate">{item.title}</h3>
              <p className="text-caption text-grey-700 mt-1">{item.author}</p>
              <div className="mt-2 flex items-center gap-3 text-caption text-grey-700">
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" /> {item.views}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3.5" /> {item.comments}
                </span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

function CommentList({ items }: { items: CommentItem[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={index === 0 ? 'px-4 py-5 md:px-5' : 'border-t border-brown/40 px-4 py-5 md:px-5'}
        >
          <p className="text-body2 font-semibold leading-[1.35] text-black md:text-head6">
            {item.postTitle}
          </p>
          <p className="mt-3 whitespace-pre-line text-body3 leading-[1.6] text-grey-800">
            └ {item.comment}
          </p>
        </li>
      ))}
    </ul>
  );
}
