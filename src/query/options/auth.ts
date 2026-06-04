import { queryOptions } from '@tanstack/react-query';
import { getCurrentUser } from '@/api/auth';

/**
 * 인증 상태 확인 queryOptions
 */
export const authQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: getCurrentUser,
  retry: false,
  // 임시: 마운트마다 인증 재확인
  staleTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: false,
});
