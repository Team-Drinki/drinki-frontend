'use client';

import { ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import ProfileSidebarCard from '@/components/profile/ProfileSidebarCard';
import DrinkCard from '@/components/common/DrinkCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  publicProfileQueryOptions,
  userTastingNotesQueryOptions,
} from '@/query/options/user';
import { ChevronRight } from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = Number(params.userId);
  const queryOptions = useMemo(() => publicProfileQueryOptions(userId), [userId]);
  const { data: profile, isLoading, isError } = useQuery({
    ...queryOptions,
    enabled: Number.isFinite(userId) && userId > 0,
  });
  const {
    data: tastingNotes,
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useQuery(userTastingNotesQueryOptions(userId, profile?.nickname));

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-grey-100 px-4 py-6 md:px-8 md:py-10 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-5 text-[clamp(2rem,8vw,2.5rem)] font-bold leading-[1.2] text-dark-brown md:mb-8">
          Profile
        </h1>

        <div className="grid grid-cols-1 items-start gap-4 md:gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileSidebarCard variant="public" profile={profile} isLoading={isLoading} />

          <div className="space-y-4 md:space-y-5">
            <ProfileSection title="Tasting Note" moreHref="/tasting-note">
              {isLoading || isNotesLoading ? (
                <p className="text-body3 text-grey-700">테이스팅 노트를 불러오는 중...</p>
              ) : isError || isNotesError ? (
                <p className="text-body3 text-grey-700">프로필 정보를 불러오지 못했어요.</p>
              ) : tastingNotes && tastingNotes.items.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {tastingNotes.items.map(note => (
                    <Link href={`/tasting-note/${note.id}`} key={note.id}>
                      <DrinkCard
                        title={note.title}
                        author={note.author}
                        imageUrl={note.imageUrl ?? '/images/whisky.png'}
                        avatarUrl={profile?.profileImageUrl ?? undefined}
                        likes={note.likes}
                        views={note.views}
                        comments={note.comments}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-body3 text-grey-700">작성한 테이스팅 노트가 없습니다.</p>
              )}
            </ProfileSection>

            <ProfileSection title="Community Post" moreHref="/community">
              <p className="text-body3 text-grey-700">공개 프로필에서도 같은 오른쪽 레이아웃을 이어서 붙일 수 있게 구성해 두었어요.</p>
            </ProfileSection>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileSection({
  title,
  moreHref,
  children,
}: {
  title: string;
  moreHref: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-none shadow-sm">
      <div className="flex items-center justify-between bg-yellow-main px-4 py-3 md:px-5">
        <h2 className="text-[1.55rem] font-semibold leading-[1.2] text-black md:text-head6">{title}</h2>
        <Link
          href={moreHref}
          className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-black md:text-body3"
        >
          more <ChevronRight className="size-4" />
        </Link>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
