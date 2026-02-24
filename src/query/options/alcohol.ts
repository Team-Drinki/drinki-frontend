import { queryOptions } from '@tanstack/react-query';
import { getAlcoholList, getRecommendedAlcoholList, getWishAlcoholList } from '@/api/alcohol';

export function alcoholListQueryOptions(params: Parameters<typeof getAlcoholList>[0]) {
  return queryOptions({
    queryKey: ['alcohol', 'list', params],
    queryFn: () => getAlcoholList(params),
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });
}

export function recommendedAlcoholListQueryOptions(page = 1, size = 9) {
  return queryOptions({
    queryKey: ['alcohol', 'recommended', page, size],
    queryFn: () => getRecommendedAlcoholList({ page, size }),
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });
}

export function wishAlcoholListQueryOptions(page = 1, size = 9) {
  return queryOptions({
    queryKey: ['alcohol', 'wishes', page, size],
    queryFn: () => getWishAlcoholList({ page, size, sort: 'CreatedAt' }),
    retry: false,
    throwOnError: false,
    staleTime: 30 * 1000,
  });
}
