import { z } from 'zod';
import { getAlcoholList } from '@/api/alcohol';
import type { HotCommunityPost, HotTastingNote } from '@/schema/api/home';
import type { AlcoholListItem } from '@/schema/api/alcohol';
import { sortByKeyWithSchema } from '@/utils/sort';

function mapToHotTastingNotes(
  items: AlcoholListItem[]
): HotTastingNote[] {
  return items.map(item => ({
    id: item.id,
    title: item.name,
    author: item.category,
    imageUrl: item.image ?? '/images/whisky.png',
    avatarUrl: '/images/avatar.png',
    likes: item.wish,
    views: item.viewCnt,
    comments: item.noteCnt,
  }));
}

function mapToHotCommunityPosts(
  items: AlcoholListItem[]
): HotCommunityPost[] {
  return items.map(item => ({
    id: item.id,
    title: item.name,
  }));
}

export interface HomeHotContent {
  hotTastingNotes: HotTastingNote[] | null;
  hotCommunityPosts: HotCommunityPost[] | null;
}

const alcoholHomeSortKeySchema = z.enum(['viewCnt', 'noteCnt', 'wish', 'rating']);

export async function getHomeHotContent(): Promise<HomeHotContent> {
  const alcoholList = await getAlcoholList({
    page: 1,
    size: 100,
    sort: 'CreatedAt',
  });

  const top10ByTastingNotes = sortByKeyWithSchema(alcoholList.items, alcoholHomeSortKeySchema, {
    key: 'noteCnt',
    order: 'desc',
    limit: 10,
  });

  const top10ByRating = sortByKeyWithSchema(alcoholList.items, alcoholHomeSortKeySchema, {
    key: 'rating',
    order: 'desc',
    limit: 10,
  });

  return {
    hotTastingNotes: mapToHotTastingNotes(top10ByTastingNotes),
    hotCommunityPosts: mapToHotCommunityPosts(top10ByRating),
  };
}
