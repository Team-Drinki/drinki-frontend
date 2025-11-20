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
