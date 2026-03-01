import { apiInstance } from './instance';
import { z } from 'zod';

const currentUserSchema = z.object({
  id: z.number(),
});

export const loginWithGoogle = (): void => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:8000`;
  window.location.href = `${apiBaseUrl}/api/v1/auth/login/google`;
};

export const getCurrentUser = async (): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const user = await apiInstance.get('users/my', { redirect: 'manual' }).json<unknown>();
    return currentUserSchema.parse(user).id;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as { response?: { status?: number; url?: string } };
      const status = httpError.response?.status;

      if (status === 401) {
        try {
          await refreshToken();
          const user = await apiInstance.get('users/my', { redirect: 'manual' }).json<unknown>();
          return currentUserSchema.parse(user).id;
        } catch {
          return null;
        }
      }

      if (status && status >= 300 && status < 400) {
        return null;
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('CORS') || error.message.includes('accounts.google.com')) {
        return null;
      }
    }

    return null;
  }
};

export const refreshToken = async (): Promise<void> => {
  await apiInstance.post('auth/refresh', {
    json: {},
    credentials: 'include',
  });
};

export const logout = async (): Promise<void> => {
  await apiInstance.post('auth/logout', {
    json: {},
    credentials: 'include',
  });
};
