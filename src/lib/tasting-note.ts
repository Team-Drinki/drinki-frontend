import type { FlavorGroupSelection } from '@/components/tasting-note/FlavorSelector';
import type { TastingNoteComment, TastingNoteDetail } from '@/schema/api/tasting-note';
import type { ApiComment } from '@/lib/comments/buildCommentTree';

export function toTastingNotePayload(selection: FlavorGroupSelection) {
  return {
    aroma_note: { selected: selection.Aroma },
    palate_note: { selected: selection.Palate },
    finish_note: { selected: selection.Finish },
  };
}

export function fromTastingNoteDetail(detail: TastingNoteDetail): FlavorGroupSelection {
  return {
    Aroma: flattenRatingMap(detail.aromaNote),
    Palate: flattenRatingMap(detail.palateNote),
    Finish: flattenRatingMap(detail.finishNote),
  };
}

export function flattenRatingMap(
  map: Record<string, Record<string, number>>
): Record<string, number> {
  const entries: Record<string, number> = {};

  Object.values(map).forEach(group => {
    Object.entries(group).forEach(([label, score]) => {
      entries[label] = score;
    });
  });

  return entries;
}

export function flattenRatingMapToTiles(
  map: Record<string, Record<string, number>>
): Array<{ label: string; score: number }> {
  return Object.entries(flattenRatingMap(map))
    .map(([label, score]) => ({ label, score }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, 'ko'));
}

export function toCommentTreeInput(comments: TastingNoteComment[]): ApiComment[] {
  return comments.map(comment => ({
    id: String(comment.id),
    authorId: 0,
    author: comment.writerNickname,
    createdAt: comment.createdAt,
    parentId: comment.parentId === null ? null : String(comment.parentId),
    content: comment.content,
    likes: comment.likeCount,
    avatarUrl: comment.writerImage ?? undefined,
  }));
}

export async function filesToDataUrls(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(
      file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
    )
  );
}
