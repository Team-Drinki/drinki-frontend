import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { apiErrorSchema } from '@/schema/api/error';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
const API_BASE_URL = `${API_ORIGIN}/api/v1`;

export const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const response = error.response;
    if (response && response.data) {
      const parsed = apiErrorSchema.safeParse(response.data);
      if (parsed.success) {
        const message = parsed.data.message || parsed.data.error;
        if (message) {
          error.message = message;
        }
      }
    }
    return Promise.reject(error);
  }
);

export type ApiOptions = AxiosRequestConfig;
