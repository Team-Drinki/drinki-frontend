import type { AppearanceColor } from '@/components/tasting-note/AppearanceBar';

export type TastingNoteMode = 'beginner' | 'expert';

export type TastingNoteMeta = {
  whiskyName?: string;
  tastingDate?: string;
  abv?: string;
  type?: string;
  price?: string;
  region?: string;
  rating?: number;
  appearance?: AppearanceColor | null;
  mode?: TastingNoteMode;
  alcoholId?: number;
};

const storageKey = (noteId: number) => `tasting-note-meta:${noteId}`;

function safeParseMeta(raw: string | null): TastingNoteMeta | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TastingNoteMeta;
  } catch {
    return null;
  }
}

export function readTastingNoteMeta(noteId: number): TastingNoteMeta | null {
  if (typeof window === 'undefined' || !Number.isFinite(noteId) || noteId <= 0) {
    return null;
  }

  const key = storageKey(noteId);
  const fromSession = safeParseMeta(window.sessionStorage.getItem(key));
  if (fromSession) {
    return fromSession;
  }

  return safeParseMeta(window.localStorage.getItem(key));
}

export function saveTastingNoteMeta(noteId: number, meta: TastingNoteMeta) {
  if (typeof window === 'undefined' || !Number.isFinite(noteId) || noteId <= 0) {
    return;
  }

  const key = storageKey(noteId);
  const serialized = JSON.stringify(meta);
  window.sessionStorage.setItem(key, serialized);
  window.localStorage.setItem(key, serialized);
}
