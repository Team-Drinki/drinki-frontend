import { z } from 'zod';

export const apiErrorSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number(),
  error: z.string().optional(),
  message: z.string().optional(),
  path: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export function isApiError(error: unknown): error is ApiError {
  return apiErrorSchema.safeParse(error).success;
}
