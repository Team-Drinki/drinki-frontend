import { queryOptions } from '@tanstack/react-query';
import { getCurrentUser } from '@/api/auth';

/**
 * 인증 상태 확인 queryOptions
 */
export const authQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: getCurrentUser,
  retry: false,
  staleTime: 5 * 60 * 1000,
});
