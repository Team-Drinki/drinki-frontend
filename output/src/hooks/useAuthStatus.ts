'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authQueryOptions } from '@/query/options/auth';

export function useAuthStatus() {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const validate = async () => {
      try {
        const userId = await queryClient.fetchQuery(authQueryOptions);
        if (!mounted) {
          return;
        }
        setIsAuthenticated(userId !== null && userId !== undefined);
      } catch {
        if (!mounted) {
          return;
        }
        setIsAuthenticated(false);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    validate();

    return () => {
      mounted = false;
    };
  }, [queryClient]);

  return { isReady, isAuthenticated };
}

