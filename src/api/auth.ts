import axios from 'axios';
import { currentUserIdSchema } from '@/schema/api/auth';
import { apiInstance } from './instance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function isAnonymousStatus(status: number): boolean {
  return status === 401 || status === 403;
}

function isRedirectStatus(status: number): boolean {
  return status >= 300 && status < 400;
}

export const loginWithGoogle = (): void => {
  window.location.href = `${API_BASE_URL}/api/v1/auth/login/google`;
};

export const getCurrentUser = async (): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { data: raw } = await apiInstance.get<unknown>('users/me');
    return currentUserIdSchema.parse(raw);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      if (isAnonymousStatus(status) || isRedirectStatus(status)) {
        return null;
      }
    }

    // Browser CORS/OAuth redirects can throw network-level errors before HTTP status is available.
    if (
      error instanceof Error &&
      (error.message.includes('CORS') || error.message.includes('accounts.google.com'))
    ) {
      return null;
    }

    return null;
  }
};

export const refreshToken = async (): Promise<void> => {
  await apiInstance.post('auth/refresh');
};

export const logout = async (): Promise<void> => {
  await apiInstance.post('auth/logout');
};
