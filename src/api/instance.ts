import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { apiErrorSchema } from '@/schema/api/error';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://localhost:8000');

export const apiInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const response = error.response;
    if (response && response.data) {
      const parsed = apiErrorSchema.safeParse(response.data);
      if (parsed.success && parsed.data.message) {
        error.message = parsed.data.message;
      }
    }
    return Promise.reject(error);
  }
);

export type ApiOptions = AxiosRequestConfig;
