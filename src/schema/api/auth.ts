import { z } from 'zod';

const userIdNumberSchema = z.coerce.number().int().positive();

const currentUserResponseSchema = z.union([
  userIdNumberSchema,
  z.object({ id: userIdNumberSchema }),
  z.object({ userId: userIdNumberSchema }),
]);

export const currentUserIdSchema = currentUserResponseSchema.transform(value =>
  typeof value === 'number' ? value : 'id' in value ? value.id : value.userId
);

export type CurrentUserId = z.infer<typeof currentUserIdSchema>;
