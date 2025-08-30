export type ApiComment = {
  id: string;
  authorId: number;
  author: string;
  createdAt: string;
  parentId: string | null;
  content: string;
  likes?: number;
  avatarUrl?: string;
};

export const mockComments: ApiComment[] = [
  // 루트 댓글들
  {
    id: 'c1',
    authorId: 1,
    author: 'Alice',
    createdAt: '2025-08-10T09:00:00.000Z',
    parentId: null,
    content: '첫 댓글입니다!',
    likes: 2,
    avatarUrl: '',
  },
  {
    id: 'c2',
    authorId: 2,
    author: 'Bob',
    createdAt: '2025-08-10T10:00:00.000Z',
    parentId: null,
    content: '두 번째 댓글 🙌',
    likes: 0,
    avatarUrl: '',
  },
  // 대댓글들
  {
    id: 'c1-1',
    authorId: 3,
    author: 'Carol',
    createdAt: '2025-08-10T10:15:00.000Z',
    parentId: 'c1',
    content: '@Alice 동의합니다!',
    likes: 1,
    avatarUrl: '',
  },
  {
    id: 'c1-2',
    authorId: 4,
    author: 'Dave',
    createdAt: '2025-08-10T11:00:00.000Z',
    parentId: 'c1-1',
    content: '추가 의견 남겨요.',
    likes: 0,
    avatarUrl: '',
  },
  {
    id: 'c1-2-1',
    authorId: 5,
    author: 'Eve',
    createdAt: '2025-08-10T11:30:00.000Z',
    parentId: 'c1',
    content: '좋은 포인트네요!',
    likes: 3,
    avatarUrl: '',
  },
  {
    id: 'c2-1',
    authorId: 6,
    author: 'Frank',
    createdAt: '2025-08-10T10:30:00.000Z',
    parentId: 'c2',
    content: '두 번째 댓글에 한 표!',
    likes: 0,
    avatarUrl: '',
  },
];
