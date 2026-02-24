import { queryOptions } from '@tanstack/react-query';
import { getHomeHotContent } from '@/api/home';

export const homeHotContentQueryOptions = queryOptions({
  queryKey: ['home', 'hot-content'],
  queryFn: async () => {
    try {
      return await getHomeHotContent();
    } catch (error) {
      console.error('Failed to fetch home hot content:', error);
      return {
        hotTastingNotes: null,
        hotCommunityPosts: null,
      };
    }
  },
  retry: false,
  staleTime: 60 * 1000,
  throwOnError: false,
});
