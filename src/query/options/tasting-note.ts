import { queryOptions } from '@tanstack/react-query';
import {
  getBestTastingNotes,
  getHotTastingNotes,
  getTastingNote,
  getTastingNoteList,
  type TastingNoteListParams,
} from '@/api/tasting-note';

export function tastingNoteListQueryOptions(params: TastingNoteListParams = {}) {
  return queryOptions({
    queryKey: ['tasting-note', 'list', params],
    queryFn: () => getTastingNoteList(params),
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });
}

export function tastingNoteDetailQueryOptions(noteId: number) {
  return queryOptions({
    queryKey: ['tasting-note', 'detail', noteId],
    queryFn: () => getTastingNote(noteId),
    enabled: Number.isFinite(noteId) && noteId > 0,
    retry: false,
    throwOnError: false,
    staleTime: 30 * 1000,
  });
}

export function hotTastingNoteQueryOptions() {
  return queryOptions({
    queryKey: ['tasting-note', 'hot'],
    queryFn: getHotTastingNotes,
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });
}

export function bestTastingNoteQueryOptions(alcoholId: number) {
  return queryOptions({
    queryKey: ['tasting-note', 'best', alcoholId],
    queryFn: () => getBestTastingNotes(alcoholId),
    enabled: Number.isFinite(alcoholId) && alcoholId > 0,
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });
}
