import { z } from 'zod';

export const tastingNoteRatingMapSchema = z.record(
  z.string(),
  z.record(z.string(), z.coerce.number())
);

export const tastingNotePageUtilSchema = z.object({
  currentPage: z.coerce.number(),
  totalPages: z.coerce.number(),
  totalCount: z.coerce.number(),
  pageSize: z.coerce.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

const tastingNoteListItemRawSchema = z.object({
  noteId: z.coerce.number(),
  noteTitle: z.string(),
  alcoholCategory: z.string(),
  alcoholName: z.string(),
  noteImage: z.string().nullable().optional(),
  writer: z.string(),
  commentNum: z.coerce.number(),
  like: z.coerce.number(),
  unlike: z.coerce.number(),
  viewer: z.coerce.number(),
  createdTime: z.union([z.string(), z.date()]),
});

export const tastingNoteListItemSchema = tastingNoteListItemRawSchema.transform(raw => ({
  id: raw.noteId,
  title: raw.noteTitle,
  alcoholCategory: raw.alcoholCategory,
  alcoholName: raw.alcoholName,
  imageUrl: raw.noteImage ?? null,
  writer: raw.writer,
  commentCount: raw.commentNum,
  likeCount: raw.like,
  unlikeCount: raw.unlike,
  viewCount: raw.viewer,
  createdAt: typeof raw.createdTime === 'string' ? raw.createdTime : raw.createdTime.toISOString(),
}));

export const tastingNoteListResponseSchema = z.object({
  notes: z.array(tastingNoteListItemSchema),
  pageUtil: tastingNotePageUtilSchema,
});

export const tastingNoteListOnlyResponseSchema = z.object({
  notes: z.array(tastingNoteListItemSchema),
});

const tastingNoteCommentRawSchema = z.object({
  commentId: z.coerce.number(),
  parentId: z.coerce.number().nullable(),
  writerNickName: z.string(),
  writerImage: z.string().nullable(),
  content: z.string(),
  like: z.coerce.number(),
  unlike: z.coerce.number(),
  createdTime: z.union([z.string(), z.date()]),
});

export const tastingNoteCommentSchema = tastingNoteCommentRawSchema.transform(raw => ({
  id: raw.commentId,
  parentId: raw.parentId,
  writerNickname: raw.writerNickName,
  writerImage: raw.writerImage,
  content: raw.content,
  likeCount: raw.like,
  unlikeCount: raw.unlike,
  createdAt: typeof raw.createdTime === 'string' ? raw.createdTime : raw.createdTime.toISOString(),
}));

export const tastingNoteDetailSchema = z
  .object({
    noteId: z.coerce.number(),
    alcoholId: z.coerce.number().nullable().optional(),
    alcoholName: z.string().optional(),
    alcoholCategory: z.string().optional(),
    title: z.string(),
    content: z.string().nullable().optional(),
    writerId: z.coerce.number(),
    writerName: z.string(),
    writerImage: z.string().nullable(),
    like: z.coerce.number(),
    unlike: z.coerce.number(),
    viewer: z.coerce.number(),
    createdTime: z.union([z.string(), z.date()]),
    aroma_note: tastingNoteRatingMapSchema,
    palate_note: tastingNoteRatingMapSchema,
    finish_note: tastingNoteRatingMapSchema,
    images: z.array(z.string()),
    comments: z.array(tastingNoteCommentSchema),
  })
  .transform(raw => ({
    id: raw.noteId,
    alcoholId: raw.alcoholId,
    alcoholName: raw.alcoholName,
    alcoholCategory: raw.alcoholCategory,
    title: raw.title,
    content: raw.content ?? null,
    writerId: raw.writerId,
    writerName: raw.writerName,
    writerImage: raw.writerImage,
    likeCount: raw.like,
    unlikeCount: raw.unlike,
    viewCount: raw.viewer,
    createdAt:
      typeof raw.createdTime === 'string' ? raw.createdTime : raw.createdTime.toISOString(),
    aromaNote: raw.aroma_note,
    palateNote: raw.palate_note,
    finishNote: raw.finish_note,
    images: raw.images,
    comments: raw.comments,
  }));

export const tastingNoteMutationResponseSchema = z.object({
  success: z.boolean(),
  id: z.coerce.number(),
});

export const tastingNoteCommentMutationResponseSchema = z.object({
  success: z.boolean(),
  id: z.coerce.number(),
});

export const tastingNoteLikeToggleResponseSchema = z.object({
  liked: z.boolean(),
  likeCount: z.coerce.number(),
});

export const tastingNoteCommentPayloadSchema = z.object({
  parentId: z.number().nullable(),
  content: z.string().min(1),
  createdTime: z.string(),
});

export const tastingNoteCreatePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string().nullable().optional(),
  alcoholId: z.number().int().positive().nullable().optional(),
  customAlcohol: z
    .object({
      name: z.string().min(1),
      category: z.string().min(1),
    })
    .nullable()
    .optional(),
  createdTime: z.string(),
  aroma_note: tastingNoteRatingMapSchema,
  palate_note: tastingNoteRatingMapSchema,
  finish_note: tastingNoteRatingMapSchema,
  images: z.array(z.string()),
});

export const tastingNoteUpdatePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string().nullable().optional(),
  aroma_note: tastingNoteRatingMapSchema,
  palate_note: tastingNoteRatingMapSchema,
  finish_note: tastingNoteRatingMapSchema,
  images: z.array(z.string()),
});

export type TastingNotePageUtil = z.infer<typeof tastingNotePageUtilSchema>;
export type TastingNoteListItem = z.infer<typeof tastingNoteListItemSchema>;
export type TastingNoteListResponse = z.infer<typeof tastingNoteListResponseSchema>;
export type TastingNoteListOnlyResponse = z.infer<typeof tastingNoteListOnlyResponseSchema>;
export type TastingNoteComment = z.infer<typeof tastingNoteCommentSchema>;
export type TastingNoteDetail = z.infer<typeof tastingNoteDetailSchema>;
export type TastingNoteCreatePayload = z.infer<typeof tastingNoteCreatePayloadSchema>;
export type TastingNoteUpdatePayload = z.infer<typeof tastingNoteUpdatePayloadSchema>;
export type TastingNoteCommentPayload = z.infer<typeof tastingNoteCommentPayloadSchema>;
export type TastingNoteLikeToggleResponse = z.infer<typeof tastingNoteLikeToggleResponseSchema>;
