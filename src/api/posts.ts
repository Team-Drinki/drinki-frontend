import { apiInstance, type ApiOptions } from './instance';

/**
 * TODO(백엔드 완성 후):
 * 1) category 허용값(enum) 확정
 * 2) Create/Update body 필드 DTO로 교체
 * 3) 응답(postId 등) 확정하면 schema + parse 추가
 */

export type CreatePostBody = {
  // TODO: 백엔드 DTO에 맞게 수정
  title: string;
  content: string;
  // imageUrls?: string[];
};

export type UpdatePostBody = Partial<CreatePostBody>;

/**
 * 글 작성
 * POST /api/v1/posts?category={category}
 */
export async function createPost(category: string, body: CreatePostBody, options?: ApiOptions): Promise<void> {
  // ky에서 querystring은 searchParams 사용 (프로젝트 규칙에 맞춤)
  await apiInstance.post('posts', {
    searchParams: { category },
    json: body,
    ...options,
  });
}

/**
 * 글 수정
 * PUT /api/v1/posts/{postId}?category={category}
 */
export async function updatePost(
  postId: number,
  category: string,
  body: UpdatePostBody,
  options?: ApiOptions
): Promise<void> {
  await apiInstance.put(`posts/${postId}`, {
    searchParams: { category },
    json: body,
    ...options,
  });
}