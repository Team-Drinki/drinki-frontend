import { z } from 'zod';

export const apiErrorSchema = z
  .object({
    timestamp: z.string().optional(),
    status: z.number().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    path: z.string().optional(),
  })
  .passthrough();

export type ApiError = z.infer<typeof apiErrorSchema>;

export function isApiError(error: unknown): error is ApiError {
  return apiErrorSchema.safeParse(error).success;
}
