import axios from 'axios';
import { currentUserIdSchema } from '@/schema/api/auth';
import { apiInstance } from './instance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

function isAnonymousStatus(status: number): boolean {
  return status === 401 || status === 403;
}

export const loginWithGoogle = (): void => {
  window.location.href = `${API_BASE_URL}/api/v1/auth/login/google`;
};

export const getCurrentUser = async (): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { data: raw } = await apiInstance.get<unknown>('users/my');
    return currentUserIdSchema.parse(raw);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // A missing response means the browser could not reach the API (for example,
      // a temporary outage or local CORS configuration). Authentication is optional
      // on public pages, so keep the app usable as an anonymous visitor.
      if (!error.response || (status != null && isAnonymousStatus(status))) {
        return null;
      }
    }

    throw error;
  }
};

export const refreshToken = async (): Promise<void> => {
  await apiInstance.post('auth/refresh');
};

export const logout = async (): Promise<void> => {
  await apiInstance.post('auth/logout');
};
