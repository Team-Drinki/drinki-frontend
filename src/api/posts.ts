import { apiInstance } from '@/api/instance';

export type PostCategory = 'FREE' | 'QUESTION';

export type CreatePostPayload = {
  title: string;
  category: PostCategory;
  body: string;
  imageUrl?: string;
};

export type CreatePostResponse = {
  id: number;
};

// 리스트
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

export type PostListResponse = {
  items: PostListItem[];
  totalPages?: number;
  totalElements?: number;
};

export type ListPostsParams = {
  page?: number;
  size?: number;
  category?: PostCategory;
  sort?: string;
};

export const createPost = async (
  payload: CreatePostPayload,
): Promise<CreatePostResponse> => {
  return apiInstance
    .post('posts', {
      // category는 query로 전달
      searchParams: {
        category: payload.category,
      },
      // category를 body에도 포함
      json: payload,
    })
    .json<CreatePostResponse>();
};


export const listPosts = async (params: ListPostsParams): Promise<PostListResponse> => {
  const searchParams: Record<string, string> = {};
  if (params.page != null) searchParams.page = String(params.page);
  if (params.size != null) searchParams.size = String(params.size);
  if (params.sort) searchParams.sort = params.sort;
  if (params.category) searchParams.category = params.category;

  return apiInstance.get('posts', { searchParams }).json<PostListResponse>();
};

export const deletePost = async (postId: string | number): Promise<void> => {
  await apiInstance.delete(`posts/${postId}`);
};