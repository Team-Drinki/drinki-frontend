'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authQueryOptions } from '@/query/options/auth';
import { wishAlcoholListQueryOptions } from '@/query/options/alcohol';
import AuthGuard from '@/components/auth/AuthGuard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, ChevronRight, Eye, Heart, MessageCircle, MessageSquare, Pencil, Users } from 'lucide-react';

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
  const { data: userId, isLoading: isUserLoading } = useQuery(authQueryOptions);
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
      comment: 'ㄴ 저는 글렌리벳 12년도 정말 추천해요.',
    },
    {
      id: 2,
      postTitle: '요즘 빠진 조합: 아벨라워 + 다크초콜릿',
      comment: 'ㄴ 이 조합 진짜 공감입니다. 피트향에도 잘 어울려요.',
    },
    {
      id: 3,
      postTitle: '테이스팅노트 어떻게 쓰고 계신가요?',
      comment: 'ㄴ 향/맛/피니시를 나눠서 쓰니 훨씬 정리되더라고요.',
    },
  ];

  return (
    <main className="bg-grey-100 min-h-[calc(100vh-8rem)] px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-head3 text-dark-brown mb-8">마이페이지</h1>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="relative w-fit mx-auto">
                <Avatar className="size-28 ring-4 ring-yellow-100">
                  <AvatarImage src="/images/avatar.png" alt="profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 size-9 rounded-full bg-yellow-main text-black hover:bg-yellow-500"
                >
                  <Pencil className="size-4" />
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-head5 text-brown font-bold">닉네임</p>
                <div className="mt-3 flex items-center justify-center gap-6 text-body3 text-grey-700">
                  <p>
                    팔로잉 <span className="font-bold text-brown">128</span>
                  </p>
                  <p>
                    팔로워 <span className="font-bold text-brown">324</span>
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-body3 text-grey-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-brown" />
                  <span>가입일: 2025.07.23</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex size-6 items-center justify-center rounded-full bg-yellow-main">
                    <MessageCircle className="size-3.5 text-black" />
                  </div>
                  <span>카카오 로그인</span>
                </div>
                {!isUserLoading && <p className="text-caption text-grey-600">User ID: {userId}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
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
    <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
      <div className="flex items-center justify-between bg-yellow-main px-5 py-3">
        <h2 className="text-head6 text-black">{title}</h2>
        <Link href={moreHref} className="inline-flex items-center gap-1 text-body3 font-semibold text-black">
          more <ChevronRight className="size-4" />
        </Link>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}

function ActivityGrid({ items }: { items: ActivityItem[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {items.slice(0, 2).map(item => (
        <Link href={item.href} key={item.id}>
          <article className="rounded-xl overflow-hidden border border-grey-200 bg-white hover:shadow-sm transition-shadow">
            <div className="relative h-36 bg-grey-100">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              <Badge className="absolute right-2 top-2 bg-yellow-main text-black hover:bg-yellow-main">
                <Heart className="mr-1 size-3.5 fill-black stroke-black" />
                {item.likes}
              </Badge>
            </div>
            <div className="px-4 py-3">
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
    <ul className="space-y-4">
      {items.map(item => (
        <li key={item.id} className="rounded-lg border border-grey-200 bg-white px-4 py-3">
          <p className="text-body3 font-semibold text-black">{item.postTitle}</p>
          <p className="mt-1 text-body3 text-grey-700">{item.comment}</p>
        </li>
      ))}
    </ul>
  );
}
