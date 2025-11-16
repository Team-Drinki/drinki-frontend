import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  socialType: z.string(),
  socialId: z.string().nullable(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  role: z.string(),
  isDeleted: z.boolean().or(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export const loginResponseSchema = z.object({
  message: z.string().optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshResponseSchema = z.object({
  message: z.string().optional(),
});

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

export const logoutResponseSchema = z.object({
  message: z.string().optional(),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
