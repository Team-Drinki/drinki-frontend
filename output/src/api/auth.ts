import { tokenManager } from '@/api/token';
import { apiInstance } from './instance';
import { z } from 'zod';

const userIdSchema = z.number();

export const loginWithGoogle = (): void => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
};

export const getCurrentUser = async (): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userId = await apiInstance.get('users/me', { redirect: 'manual' }).json<number>();
    return userIdSchema.parse(userId);
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as { response?: { status?: number; url?: string } };
      const status = httpError.response?.status;

      if (status === 401) {
        return null;
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
  tokenManager.clearTokens();
};
