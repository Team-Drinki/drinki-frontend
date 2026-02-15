import { z } from 'zod';

const alcoholRelationSchema = z
  .object({
    id: z.number(),
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
  image: data.imageUrl,
  proof: data.proof,
  category: data.category?.name ?? '',
  location: data.location?.name ?? '',
  style: data.style?.name ?? '',
  description: data.content,
  wish: data.wishCnt,
  rating: data.rating,
  isWish: false,
}));

export type AlcoholDetail = z.infer<typeof alcoholDetailSchema>;

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
