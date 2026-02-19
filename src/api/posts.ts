import { apiInstance } from '@/api/instance';
import { HTTPError } from 'ky';

// Backend schema reference:
// - drinki-backend-ts/src/modules/post/model.ts
// - postCreateRequest / postUpdateRequest / postItem / postListRequest / postListResponse
export type PostCategory = 'FREE' | 'QUESTION';

// postCreateRequest 대응 타입
export type CreatePostPayload = {
  title: string;
  category: PostCategory;
  body: string;
  imageUrl?: string;
};

// POST /api/v1/posts 응답(생성된 게시글 row)
export type CreatePostResponse = {
  id: number;
};

// postUpdateRequest 대응 타입
export type UpdatePostPayload = {
  title?: string;
  category?: PostCategory;
  body?: string;
  imageUrl?: string;
};

export type PostAuthor = {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
};

// postItem 대응 타입 (GET /api/v1/posts/:postId)
export type PostDetailResponse = {
  id: number;
  userId: number;
  author: PostAuthor;
  title: string;
  imageUrl?: string;
  category: string;
  body: string;
  viewCnt: number;
  likeCnt: number;
  commentCnt: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

// 리스트 카드용 프론트 표현 타입
export type PostListItem = {
  id: string | number;
  title: string;
  author?: string;
  imageUrl?: string;
  avatarUrl?: string;
  likes?: number;
  views?: number;
  comments?: number;
  category?: PostCategory;
  createdAt?: string;
};

// postListResponse 대응 타입
export type PostListResponse = {
  items: PostListItem[];
  totalPages?: number;
  totalElements?: number;
};

// postListRequest 대응 타입
export type ListPostsParams = {
  page?: number;
  size?: number;
  category?: PostCategory;
  sort?: string;
};

//write/edit 페이지에서 동일한 에러 메시지를 쓰기 위한 공통 변환 함수.
export async function toApiErrorMessage(error: unknown, fallback = '알 수 없는 오류가 발생했습니다.') {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    let message = `요청 실패 (${status})`;

    try {
      const body = (await error.response.clone().json()) as { message?: string; error?: string };
      message = body?.message ?? body?.error ?? message;
    } catch {
      try {
        const text = await error.response.clone().text();
        if (text) message = text;
      } catch {
        // no-op: 응답 바디를 더 이상 읽을 수 없는 경우 기본 메시지를 유지한다.
      }
    }

    return message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

// 개발용 x-dev-user-id 
function withDevAuthHeader() {
  //기존 write/edit에 있던 개발용 x-dev-user-id 헤더를 공통 API 계층으로 이동.
  if (process.env.NODE_ENV === 'production') {
    return undefined;
  }

  return { 'x-dev-user-id': '1' };
}

export const createPost = async (
  payload: CreatePostPayload,
): Promise<CreatePostResponse> => {
  // POST /api/v1/posts
  return apiInstance
    .post('posts', {
      json: payload,
      headers: withDevAuthHeader(),
    })
    .json<CreatePostResponse>();
};

export const getPostById = async (postId: string | number): Promise<PostDetailResponse> => {
  // GET /api/v1/posts/:postId
  return apiInstance
    .get(`posts/${postId}`, {
      headers: withDevAuthHeader(),
    })
    .json<PostDetailResponse>();
};

export const updatePost = async (
  postId: string | number,
  payload: UpdatePostPayload,
): Promise<PostDetailResponse> => {
  // PUT /api/v1/posts/:postId
  return apiInstance
    .put(`posts/${postId}`, {
      json: payload,
      headers: withDevAuthHeader(),
    })
    .json<PostDetailResponse>();
};

export const listPosts = async (params: ListPostsParams): Promise<PostListResponse> => {
  // GET /api/v1/posts
  const searchParams: Record<string, string> = {};
  if (params.page != null) searchParams.page = String(params.page);
  if (params.size != null) searchParams.size = String(params.size);
  if (params.sort) searchParams.sort = params.sort;
  if (params.category) searchParams.category = params.category;

  return apiInstance.get('posts', { searchParams }).json<PostListResponse>();
};

export const deletePost = async (postId: string | number): Promise<void> => {
  await apiInstance.delete(`posts/${postId}`, {
    headers: withDevAuthHeader(),
  });
};
