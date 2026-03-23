import { apiInstance } from '@/api/instance';
import {
  tastingNoteCommentMutationResponseSchema,
  tastingNoteCommentPayloadSchema,
  tastingNoteCreatePayloadSchema,
  tastingNoteDetailSchema,
  tastingNoteListOnlyResponseSchema,
  tastingNoteListResponseSchema,
  tastingNoteMutationResponseSchema,
  tastingNoteUpdatePayloadSchema,
  type TastingNoteCommentPayload,
  type TastingNoteCreatePayload,
  type TastingNoteDetail,
  type TastingNoteListResponse,
  type TastingNoteUpdatePayload,
} from '@/schema/api/tasting-note';

export interface TastingNoteListParams {
  query?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getTastingNoteList(
  params: TastingNoteListParams = {}
): Promise<TastingNoteListResponse> {
  const { data } = await apiInstance.get<unknown>('notes', {
    params: {
      query: params.query ?? '',
      category: params.category ?? '',
      page: params.page ?? 1,
      size: params.size ?? 9,
      sort: params.sort ?? 'createdAt',
    },
  });

  return tastingNoteListResponseSchema.parse(data);
}

export async function getTastingNote(noteId: number): Promise<TastingNoteDetail> {
  const { data } = await apiInstance.get<unknown>(`notes/${noteId}`);
  return tastingNoteDetailSchema.parse(data);
}

export async function getHotTastingNotes() {
  const { data } = await apiInstance.get<unknown>('notes/hot');
  return tastingNoteListOnlyResponseSchema.parse(data).notes;
}

export async function getBestTastingNotes(alcoholId: number) {
  const { data } = await apiInstance.get<unknown>(`notes/best/${alcoholId}`);
  return tastingNoteListOnlyResponseSchema.parse(data).notes;
}

export async function createTastingNote(payload: TastingNoteCreatePayload) {
  const body = tastingNoteCreatePayloadSchema.parse(payload);
  const { data } = await apiInstance.post<unknown>('notes', body);
  return tastingNoteMutationResponseSchema.parse(data);
}

export async function updateTastingNote(noteId: number, payload: TastingNoteUpdatePayload) {
  const body = tastingNoteUpdatePayloadSchema.parse(payload);
  const { data } = await apiInstance.put<unknown>(`notes/${noteId}`, body);
  return tastingNoteMutationResponseSchema.parse(data);
}

export async function deleteTastingNote(noteId: number) {
  const { data } = await apiInstance.delete<unknown>(`notes/${noteId}`);
  return tastingNoteMutationResponseSchema.parse(data);
}

export async function createTastingNoteComment(noteId: number, payload: TastingNoteCommentPayload) {
  const body = tastingNoteCommentPayloadSchema.parse(payload);
  const { data } = await apiInstance.post<unknown>(`notes/${noteId}/comments`, body);
  return tastingNoteCommentMutationResponseSchema.parse(data);
}

export async function updateTastingNoteComment(
  noteId: number,
  commentId: number,
  content: string
) {
  const { data } = await apiInstance.put<unknown>(`notes/${noteId}/comments/${commentId}`, {
    content,
  });
  return tastingNoteCommentMutationResponseSchema.parse(data);
}

export async function deleteTastingNoteComment(noteId: number, commentId: number) {
  const { data } = await apiInstance.delete<unknown>(`notes/${noteId}/comments/${commentId}`);
  return tastingNoteCommentMutationResponseSchema.parse(data);
}
