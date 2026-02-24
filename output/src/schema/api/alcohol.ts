import { z } from 'zod';

export const alcoholDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  proof: z.number(),
  image: z.string().nullable(),
  category: z.string(),
  location: z.string(),
  style: z.string(),
  description: z.string(),
  wish: z.number(),
  rating: z.number(),
  isWish: z.boolean(),
});

export type AlcoholDetail = z.infer<typeof alcoholDetailSchema>;

const numberFromUnknown = z.coerce.number();

export const pageUtilSchema = z.object({
  currentPage: numberFromUnknown,
  totalPages: numberFromUnknown,
  totalCount: numberFromUnknown,
  pageSize: numberFromUnknown,
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const alcoholListItemSchema = z.object({
  id: numberFromUnknown,
  name: z.string(),
  image: z.string().nullable(),
  category: z.string(),
  wish: numberFromUnknown,
  rating: numberFromUnknown,
  viewCnt: numberFromUnknown,
  noteCnt: numberFromUnknown,
  isWish: z.boolean(),
});

export const alcoholListResponseSchema = z.object({
  items: z.array(alcoholListItemSchema),
  pageUtil: pageUtilSchema,
});

export type AlcoholListItem = z.infer<typeof alcoholListItemSchema>;
export type AlcoholListResponse = z.infer<typeof alcoholListResponseSchema>;
