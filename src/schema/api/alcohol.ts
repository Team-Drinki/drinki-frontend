import { z } from 'zod';

function normalizeOptionalImage(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const alcoholRelationSchema = z
  .object({
    id: z.coerce.number(),
    name: z.string(),
  })
  .nullable();

const alcoholDetailResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  price: z.number(),
  proof: z.number(),
  rating: z.number(),
  wishCnt: z.number(),
  viewCnt: z.number(),
  noteCnt: z.number(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  category: alcoholRelationSchema,
  location: alcoholRelationSchema,
  style: alcoholRelationSchema,
});

export const alcoholDetailSchema = alcoholDetailResponseSchema.transform(data => ({
  id: data.id,
  name: data.name,
  image: normalizeOptionalImage(data.imageUrl),
  price: data.price,
  proof: data.proof,
  categoryId: data.category?.id ?? null,
  category: data.category?.name ?? '',
  location: data.location?.name ?? '',
  style: data.style?.name ?? '',
  description: data.content,
  wish: data.wishCnt,
  rating: data.rating,
  isWish: false,
}));

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

const alcoholListItemRawSchema = z.object({
  id: numberFromUnknown,
  name: z.string(),
  imageUrl: z.string().nullable(),
  price: numberFromUnknown,
  proof: numberFromUnknown,
  rating: numberFromUnknown,
  wishCnt: numberFromUnknown,
  viewCnt: numberFromUnknown,
  noteCnt: numberFromUnknown,
  category: alcoholRelationSchema.optional(),
  location: alcoholRelationSchema.optional(),
  style: alcoholRelationSchema.optional(),
});

export const alcoholListItemSchema = alcoholListItemRawSchema.transform(data => ({
  id: data.id,
  name: data.name,
  image: normalizeOptionalImage(data.imageUrl),
  price: data.price,
  proof: data.proof,
  categoryId: data.category?.id ?? null,
  category: data.category?.name ?? '',
  location: data.location?.name ?? '',
  style: data.style?.name ?? '',
  wish: data.wishCnt,
  rating: data.rating,
  viewCnt: data.viewCnt,
  noteCnt: data.noteCnt,
  isWish: false,
}));

const alcoholSearchPaginationSchema = z.object({
  page: numberFromUnknown,
  size: numberFromUnknown,
  total: numberFromUnknown,
  totalPages: numberFromUnknown,
});

export const alcoholListResponseSchema = z
  .object({
    data: z.array(alcoholListItemRawSchema),
    pagination: alcoholSearchPaginationSchema,
  })
  .transform(data => ({
    items: data.data.map(item => alcoholListItemSchema.parse(item)),
    pageUtil: {
      currentPage: data.pagination.page,
      totalPages: data.pagination.totalPages,
      totalCount: data.pagination.total,
      pageSize: data.pagination.size,
      hasNext: data.pagination.page < data.pagination.totalPages,
      hasPrevious: data.pagination.page > 1,
    },
  }));

export type AlcoholListItem = z.infer<typeof alcoholListItemSchema>;
export type AlcoholListResponse = z.infer<typeof alcoholListResponseSchema>;

const alcoholRecommendationItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  wishCnt: z.number(),
  viewCnt: z.number(),
  noteCnt: z.number(),
});

export const alcoholRecommendationsSchema = z.object({
  recommendations: z.array(alcoholRecommendationItemSchema),
});

export type AlcoholRecommendation = z.infer<typeof alcoholRecommendationItemSchema>;
