import { apiInstance } from '@/api/instance';
import { z } from 'zod';

const myProfileSchema = z.object({
  id: z.coerce.number(),
  socialType: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  wishCnt: z.coerce.number(),
  noteCnt: z.coerce.number(),
  createdAt: z.union([z.string(), z.date()]),
});

export type MyProfile = z.infer<typeof myProfileSchema>;
const publicProfileSchema = z.object({
  id: z.coerce.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  wishCnt: z.coerce.number(),
  noteCnt: z.coerce.number(),
  createdAt: z.union([z.string(), z.date()]),
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;
const updateMyProfileRequestSchema = z.object({
  nickname: z.string().min(2).max(20).optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export type UpdateMyProfileRequest = z.infer<typeof updateMyProfileRequestSchema>;

export async function getMyProfile(): Promise<MyProfile> {
  const { data } = await apiInstance.get<unknown>('users/my');
  return myProfileSchema.parse(data);
}

export async function getPublicProfile(userId: number): Promise<PublicProfile> {
  const { data } = await apiInstance.get<unknown>(`users/${userId}`);
  return publicProfileSchema.parse(data);
}

export async function updateMyProfile(request: UpdateMyProfileRequest): Promise<MyProfile> {
  const payload = updateMyProfileRequestSchema.parse(request);
  const { data } = await apiInstance.post<unknown>('users/my', payload);
  return myProfileSchema.parse(data);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('이미지 파일을 읽는 데 실패했어요.'));
    };

    reader.onerror = () => {
      reject(new Error('이미지 파일을 읽는 데 실패했어요.'));
    };

    reader.readAsDataURL(file);
  });
}
