'use client';

import Link from 'next/link';
import { MessageCircle, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatJoinDate, getNicknameFallback, getSocialTypeLabel } from '@/lib/user-profile';

type BaseProfile = {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  wishCnt: number;
  noteCnt: number;
  createdAt: string | Date;
};

type OwnProfile = BaseProfile & {
  socialType: string;
};

type PublicProfile = BaseProfile;

type Props =
  | {
      variant: 'me';
      profile?: OwnProfile;
      isLoading?: boolean;
    }
  | {
      variant: 'public';
      profile?: PublicProfile;
      isLoading?: boolean;
    };

export default function ProfileSidebarCard(props: Props) {
  const isOwnProfile = props.variant === 'me';
  const profile = props.profile;
  const socialType = props.variant === 'me' ? props.profile?.socialType : undefined;
  const nickname = props.isLoading ? '불러오는 중...' : (profile?.nickname ?? '닉네임');

  return (
    <Card className="overflow-hidden rounded-[24px] border-none bg-white shadow-sm">
      <CardContent className="px-7 py-8 md:px-8 md:py-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="size-36 border-[3px] border-yellow-main md:size-40">
              <AvatarImage src={profile?.profileImageUrl ?? '/images/avatar.png'} alt="profile" />
              <AvatarFallback className="bg-[#FFF8E1] text-[2rem] font-bold text-brown">
                {getNicknameFallback(profile?.nickname ?? 'U')}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <Button
                asChild
                size="icon"
                className="absolute bottom-1 right-0 size-11 rounded-full bg-yellow-main text-black shadow-none hover:bg-yellow-500"
              >
                <Link href="/mypage/edit" aria-label="프로필 편집">
                  <Pencil className="size-5" />
                </Link>
              </Button>
            )}
          </div>

          <h2 className="mt-12 text-[2rem] font-bold leading-none text-black">{nickname}</h2>

          <div className="mt-10 grid w-full grid-cols-2 gap-10">
            <ProfileCount label="팔로잉" value={0} />
            <ProfileCount label="팔로워" value={0} />
          </div>

          <div className="mt-12 space-y-9">
            <InfoBlock label="가입날짜" value={profile ? formatJoinDate(profile.createdAt) : '-'} />

            {isOwnProfile ? (
              <div className="space-y-4">
                <p className="text-[1.1rem] font-semibold text-black">소셜로그인 타입</p>
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-main">
                  <MessageCircle className="size-5 text-black" />
                </div>
                <p className="text-sm text-grey-700">
                  {socialType ? getSocialTypeLabel(socialType) : '-'}
                </p>
              </div>
            ) : (
              <Button
                type="button"
                disabled
                className="h-12 min-w-40 rounded-xl bg-yellow-main px-8 text-[1.1rem] font-semibold text-black hover:bg-yellow-500"
                title="팔로우 기능은 준비 중입니다."
              >
                팔로우 준비 중
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-[1.1rem] font-semibold text-black">{label}</p>
      <p className="text-[2rem] font-bold leading-none text-black">
        {String(value).padStart(3, '0')}
      </p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-[1.1rem] font-semibold text-black">{label}</p>
      <p className="text-[1.8rem] font-bold leading-none text-black">{value}</p>
    </div>
  );
}
