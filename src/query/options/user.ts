import { queryOptions } from '@tanstack/react-query';
import { getMyProfile, getPublicProfile } from '@/api/user';

export const myProfileQueryOptions = queryOptions({
  queryKey: ['user', 'myProfile'],
  queryFn: getMyProfile,
});

export const publicProfileQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['user', 'publicProfile', userId],
    queryFn: () => getPublicProfile(userId),
  });
