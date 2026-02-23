import { z } from 'zod';

const hotTastingNoteRawSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    title: z.string().optional(),
    name: z.string().optional(),
    alcoholName: z.string().optional(),
    author: z.string().optional(),
    authorNickname: z.string().optional(),
    imageUrl: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    profileImage: z.string().nullable().optional(),
    likes: z.coerce.number().optional(),
    like: z.coerce.number().optional(),
    likeCount: z.coerce.number().optional(),
    views: z.coerce.number().optional(),
    viewCnt: z.coerce.number().optional(),
    viewCount: z.coerce.number().optional(),
    comments: z.coerce.number().optional(),
    commentCnt: z.coerce.number().optional(),
    commentCount: z.coerce.number().optional(),
  })
  .passthrough();

export const hotTastingNoteSchema = hotTastingNoteRawSchema.transform(raw => ({
  id: Number(raw.id),
  title: raw.title ?? raw.name ?? raw.alcoholName ?? 'Untitled tasting note',
  author: raw.author ?? raw.authorNickname ?? 'Unknown',
  imageUrl: raw.imageUrl ?? raw.image ?? raw.thumbnail ?? '/images/whisky.png',
  avatarUrl: raw.avatarUrl ?? raw.profileImage ?? '/images/avatar.png',
  likes: raw.likes ?? raw.like ?? raw.likeCount ?? 0,
  views: raw.views ?? raw.viewCnt ?? raw.viewCount ?? 0,
  comments: raw.comments ?? raw.commentCnt ?? raw.commentCount ?? 0,
}));

const hotCommunityPostRawSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    title: z.string().optional(),
    postTitle: z.string().optional(),
    name: z.string().optional(),
  })
  .passthrough();

export const hotCommunityPostSchema = hotCommunityPostRawSchema.transform(raw => ({
  id: Number(raw.id),
  title: raw.title ?? raw.postTitle ?? raw.name ?? 'Untitled post',
}));

export type HotTastingNote = z.infer<typeof hotTastingNoteSchema>;
export type HotCommunityPost = z.infer<typeof hotCommunityPostSchema>;
