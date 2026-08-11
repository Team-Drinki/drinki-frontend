'use client';

import { useQuery } from '@tanstack/react-query';
import { authQueryOptions } from '@/query/options/auth';

export function useAuthStatus() {
  const { data: userId, error, isPending, isError, refetch } = useQuery(authQueryOptions);
  const isReady = !isPending;
  const isAuthenticated = !isPending && !isError && userId !== null && userId !== undefined;

  return { userId, error, isReady, isAuthenticated, isError, refetch };
}
