import { z } from 'zod';
import { getAlcoholList } from '@/api/alcohol';
import { getHotTastingNotes } from '@/api/tasting-note';
import type { HotCommunityPost, HotTastingNote } from '@/schema/api/home';
import type { AlcoholListItem } from '@/schema/api/alcohol';
import type { TastingNoteListItem } from '@/schema/api/tasting-note';
import { sortByKeyWithSchema } from '@/utils/sort';

function mapToHotTastingNotes(items: TastingNoteListItem[]): HotTastingNote[] {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    author: item.writer,
    imageUrl: item.imageUrl ?? '/images/whisky.png',
    avatarUrl: '/images/avatar.png',
    likes: item.likeCount,
    views: item.viewCount,
    comments: item.commentCount,
  }));
}

function mapToHotCommunityPosts(items: AlcoholListItem[]): HotCommunityPost[] {
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
  const [hotTastingNotesResult, alcoholListResult] = await Promise.allSettled([
    getHotTastingNotes(),
    getAlcoholList({
      page: 1,
      size: 100,
      sort: 'CreatedAt',
    }),
  ]);

  const hotTastingNotes =
    hotTastingNotesResult.status === 'fulfilled'
      ? mapToHotTastingNotes(hotTastingNotesResult.value)
      : null;

  const hotCommunityPosts =
    alcoholListResult.status === 'fulfilled'
      ? mapToHotCommunityPosts(
          sortByKeyWithSchema(alcoholListResult.value.items, alcoholHomeSortKeySchema, {
            key: 'rating',
            order: 'desc',
            limit: 10,
          })
        )
      : null;

  return {
    hotTastingNotes,
    hotCommunityPosts,
  };
}
