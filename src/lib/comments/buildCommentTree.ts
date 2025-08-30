export type ApiComment = {
  id: string;
  authorId: number;
  author: string;
  createdAt: string; // ISO string
  parentId: string | null;
  content: string;
  likes?: number;
  avatarUrl?: string;
};
export type CommentNode = ApiComment & { children: CommentNode[] };

export function buildCommentTree(flat: ApiComment[]): CommentNode[] {
  const sorted = [...flat].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const byId = new Map<string, CommentNode>();
  for (const c of sorted) byId.set(c.id, { ...c, children: [] });

  const roots: CommentNode[] = [];
  for (const c of sorted) {
    const node = byId.get(c.id)!;
    if (!c.parentId) {
      roots.push(node);
    } else {
      const p = byId.get(c.parentId);
      (p ? p.children : roots).push(node);
    }
  }

  // 방어적: 형제도 시간 오름차순
  const sortRec = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    nodes.forEach(n => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}
