import { queryOptions } from '@tanstack/react-query';
import {
  getMyComments,
  getMyProfile,
  getMyTastingNotes,
  getPublicProfile,
  getUserTastingNotes,
} from '@/api/user';

export const myProfileQueryOptions = queryOptions({
  queryKey: ['user', 'myProfile'],
  queryFn: getMyProfile,
});

export const publicProfileQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['user', 'publicProfile', userId],
    queryFn: () => getPublicProfile(userId),
  });

export const myTastingNotesQueryOptions = (nickname?: string) =>
  queryOptions({
    queryKey: ['user', 'myTastingNotes', nickname],
    queryFn: () => getMyTastingNotes(nickname!, 1, 2),
    enabled: Boolean(nickname),
  });

export const myCommentsQueryOptions = queryOptions({
  queryKey: ['user', 'myComments'],
  queryFn: () => getMyComments(1, 3),
});

export const userTastingNotesQueryOptions = (userId: number, nickname?: string) =>
  queryOptions({
    queryKey: ['user', 'tastingNotes', userId],
    queryFn: () => getUserTastingNotes(userId, nickname!, 1, 2),
    enabled: Number.isFinite(userId) && userId > 0 && Boolean(nickname),
  });
