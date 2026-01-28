import { apiInstance, type ApiOptions } from './instance';

/**
 * TODO(백엔드 완성 후):
 * 1) Create/Update body 필드를 실제 DTO로 교체
 * 2) 응답이 무엇을 주는지(noteId, note 객체 등) 확정해서 schema + parse 추가
 * 3) 이미지 업로드가 들어가면 json 대신 multipart/form-data로 변경
 */

export type CreateNoteBody = {
  // TODO: 백엔드 DTO에 맞게 수정
  alcoholId: number;
  title: string;
  content: string;
  rating: number;
  // nose?: string;
  // palate?: string;
  // finish?: string;
  // imageUrls?: string[];
};

export type UpdateNoteBody = Partial<CreateNoteBody>;

/**
 * 노트 작성
 * POST /api/v1/notes
 */
export async function createNote(body: CreateNoteBody, options?: ApiOptions): Promise<void> {
  // TODO: (.json<unknown>() + schema.parse)로 변경
  await apiInstance.post('notes', { json: body, ...options });
}

/**
 * 노트 수정
 * PUT /api/v1/notes/{noteId}
 */
export async function updateNote(noteId: number, body: UpdateNoteBody, options?: ApiOptions): Promise<void> {
  // TODO: (.json<unknown>() + schema.parse)로 변경
  await apiInstance.put(`notes/${noteId}`, { json: body, ...options });
}