import { apiInstance } from '@/api/instance';
import { getTastingNoteList } from '@/api/tasting-note';
import axios from 'axios';
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

const pageUtilSchema = z.object({
  page: z.coerce.number(),
  size: z.coerce.number(),
  total: z.coerce.number(),
  totalPages: z.coerce.number(),
});

const myTastingNoteListSchema = z.object({
  items: z.array(
    z.object({
      id: z.coerce.number(),
      title: z.string(),
      author: z.string(),
      imageUrl: z.string().nullable(),
      likes: z.coerce.number(),
      views: z.coerce.number(),
      comments: z.coerce.number(),
      createdAt: z.union([z.string(), z.date()]),
    })
  ),
  pageUtil: pageUtilSchema,
});

const myCommentListSchema = z.object({
  items: z.array(
    z.object({
      id: z.coerce.number(),
      targetType: z.enum(['post', 'tasting_note', 'alcohol']),
      targetId: z.coerce.number(),
      targetTitle: z.string(),
      body: z.string(),
      createdAt: z.union([z.string(), z.date()]),
    })
  ),
  pageUtil: pageUtilSchema,
});

export type MyTastingNoteList = z.infer<typeof myTastingNoteListSchema>;
export type MyCommentList = z.infer<typeof myCommentListSchema>;

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

export async function getMyTastingNotes(
  nickname: string,
  page = 1,
  size = 2
): Promise<MyTastingNoteList> {
  try {
    const { data } = await apiInstance.get<unknown>('users/my/notes', { params: { page, size } });
    const result = myTastingNoteListSchema.parse(data);

    if (result.items.length > 0) {
      return result;
    }
  } catch {
    // 구버전 운영 API와 호환하기 위해 공개 목록 기반 조회로 전환한다.
  }

  const allNotes = await getTastingNoteList({ page: 1, size: 100, sort: 'createdAt' });
  const normalizedNickname = nickname.trim();
  const ownNotes = allNotes.notes.filter(note => note.writer.trim() === normalizedNickname);
  const offset = (page - 1) * size;

  return {
    items: ownNotes.slice(offset, offset + size).map(note => ({
      id: note.id,
      title: note.title,
      author: note.writer,
      imageUrl: note.imageUrl,
      likes: note.likeCount,
      views: note.viewCount,
      comments: note.commentCount,
      createdAt: note.createdAt,
    })),
    pageUtil: {
      page,
      size,
      total: ownNotes.length,
      totalPages: Math.ceil(ownNotes.length / size),
    },
  };
}

export async function getUserTastingNotes(
  userId: number,
  nickname: string,
  page = 1,
  size = 2
): Promise<MyTastingNoteList> {
  try {
    const { data } = await apiInstance.get<unknown>(`users/${userId}/notes`, {
      params: { page, size },
    });
    return myTastingNoteListSchema.parse(data);
  } catch {
    // 구버전 운영 API에서는 공개 목록의 작성자 닉네임으로 호환 조회한다.
    const allNotes = await getTastingNoteList({ page: 1, size: 100, sort: 'createdAt' });
    const normalizedNickname = nickname.trim();
    const ownNotes = allNotes.notes.filter(note => note.writer.trim() === normalizedNickname);
    const offset = (page - 1) * size;

    return {
      items: ownNotes.slice(offset, offset + size).map(note => ({
        id: note.id,
        title: note.title,
        author: note.writer,
        imageUrl: note.imageUrl,
        likes: note.likeCount,
        views: note.viewCount,
        comments: note.commentCount,
        createdAt: note.createdAt,
      })),
      pageUtil: {
        page,
        size,
        total: ownNotes.length,
        totalPages: Math.ceil(ownNotes.length / size),
      },
    };
  }
}

export async function getMyComments(page = 1, size = 3): Promise<MyCommentList> {
  try {
    const { data } = await apiInstance.get<unknown>('users/my/comments', {
      params: { page, size },
    });
    return myCommentListSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        items: [],
        pageUtil: { page, size, total: 0, totalPages: 0 },
      };
    }

    throw error;
  }
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
