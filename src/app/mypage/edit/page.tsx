'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, ChevronLeft, LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AuthGuard from '@/components/auth/AuthGuard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fileToDataUrl, updateMyProfile } from '@/api/user';
import { getNicknameFallback } from '@/lib/user-profile';
import { myProfileQueryOptions } from '@/query/options/user';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export default function MyProfileEditPage() {
  return (
    <AuthGuard>
      <MyProfileEditContent />
    </AuthGuard>
  );
}

function MyProfileEditContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading } = useQuery(myProfileQueryOptions);
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!profile || isInitialized) {
      return;
    }

    setNickname(profile.nickname);
    setProfileImageUrl(profile.profileImageUrl);
    setIsInitialized(true);
  }, [isInitialized, profile]);

  const trimmedNickname = nickname.trim();
  const nicknameError = useMemo(() => {
    if (trimmedNickname.length === 0) return '닉네임을 입력해 주세요.';
    if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
      return '닉네임은 2자 이상 20자 이하로 입력해 주세요.';
    }

    return null;
  }, [trimmedNickname]);

  const hasChanges =
    !!profile &&
    (trimmedNickname !== profile.nickname || profileImageUrl !== profile.profileImageUrl);

  const updateProfileMutation = useMutation({
    mutationFn: async () =>
      updateMyProfile({
        nickname: trimmedNickname,
        profileImageUrl,
      }),
    onSuccess: updatedProfile => {
      queryClient.setQueryData(myProfileQueryOptions.queryKey, updatedProfile);
      toast.success('프로필을 저장했어요.', { duration: 1200 });
      router.replace('/mypage');
      router.refresh();
    },
    onError: error => {
      const message = error instanceof Error ? error.message : '프로필 저장 중 문제가 발생했어요.';
      toast.error(message, { duration: 1400 });
    },
  });

  const handleSelectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있어요.', { duration: 1400 });
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('이미지는 5MB 이하로 선택해 주세요.', { duration: 1400 });
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setProfileImageUrl(dataUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : '이미지를 불러오지 못했어요.';
      toast.error(message, { duration: 1400 });
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setProfileImageUrl(null);
  };

  const handleSubmit = async () => {
    if (nicknameError) {
      toast.error(nicknameError, { duration: 1400 });
      return;
    }

    if (!hasChanges || updateProfileMutation.isPending) {
      return;
    }

    await updateProfileMutation.mutateAsync();
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-grey-100 px-4 py-6 md:px-8 md:py-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/mypage"
          className="mb-4 inline-flex items-center gap-1 text-body3 font-medium text-grey-700"
        >
          <ChevronLeft className="size-4" />
          마이페이지로 돌아가기
        </Link>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader className="space-y-2 p-6 md:p-8">
            <CardTitle className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold text-dark-brown">
              프로필 편집
            </CardTitle>
            <p className="text-body3 text-grey-700">사진과 닉네임을 수정할 수 있어요.</p>
          </CardHeader>

          <CardContent className="space-y-8 p-6 pt-0 md:p-8 md:pt-0">
            {isLoading || !profile ? (
              <div className="flex min-h-64 items-center justify-center text-body3 text-grey-700">
                프로필 정보를 불러오는 중...
              </div>
            ) : (
              <>
                <section className="flex flex-col items-center rounded-2xl bg-[#FFF8E1] px-5 py-8 text-center">
                  <Avatar className="size-28 ring-4 ring-white md:size-32">
                    <AvatarImage
                      src={profileImageUrl ?? '/images/avatar.png'}
                      alt="profile preview"
                    />
                    <AvatarFallback className="bg-yellow-main text-xl font-bold text-black">
                      {getNicknameFallback(trimmedNickname || profile.nickname)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      type="button"
                      className="bg-brown text-white hover:bg-brown/90"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Camera className="size-4" />
                      사진 변경
                    </Button>
                    <Button type="button" variant="outline" onClick={handleRemoveImage}>
                      <Trash2 className="size-4" />
                      사진 제거
                    </Button>
                  </div>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectImage}
                  />

                  <p className="mt-3 text-caption text-grey-700">
                    JPG, PNG, WEBP 파일을 5MB 이하로 업로드해 주세요.
                  </p>
                </section>

                <section className="space-y-3">
                  <Label htmlFor="nickname" className="text-body3 font-semibold text-brown">
                    닉네임
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    maxLength={20}
                    onChange={event => setNickname(event.target.value)}
                    placeholder="닉네임을 입력해 주세요"
                    className="h-12 rounded-xl border-grey-300 bg-white px-4 text-body3"
                  />
                  <div className="flex items-center justify-between text-caption">
                    <p className={nicknameError ? 'text-red-500' : 'text-grey-700'}>
                      {nicknameError ?? '2자 이상 20자 이하로 입력할 수 있어요.'}
                    </p>
                    <span className="text-grey-600">{trimmedNickname.length}/20</span>
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-6"
                    onClick={() => router.push('/mypage')}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    className="h-11 bg-yellow-main px-6 text-black hover:bg-yellow-500"
                    disabled={!hasChanges || !!nicknameError || updateProfileMutation.isPending}
                    onClick={handleSubmit}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      '저장하기'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
