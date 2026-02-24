import { z } from 'zod';

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

export const sortBaseOptionSchema = z.object({
  order: sortOrderSchema.optional(),
  limit: z.number().int().positive().optional(),
});

type PrimitiveSortable = string | number | null | undefined;

function toComparableValue(value: PrimitiveSortable): string | number {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? 0 : value;
  }

  if (typeof value === 'string') {
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }

    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp)) {
      return timestamp;
    }

    return value.toLowerCase();
  }

  return 0;
}

function comparePrimitive(a: PrimitiveSortable, b: PrimitiveSortable): number {
  const lhs = toComparableValue(a);
  const rhs = toComparableValue(b);

  if (typeof lhs === 'string' && typeof rhs === 'string') {
    return lhs.localeCompare(rhs);
  }

  return Number(lhs) - Number(rhs);
}

export function sortByKeyWithSchema<T, K extends string>(
  items: T[],
  keySchema: z.ZodEnum<[K, ...K[]]>,
  input: { key: K; order?: 'asc' | 'desc'; limit?: number },
  getValue: (item: T, key: K) => PrimitiveSortable = (item, key) =>
    (item as Record<string, PrimitiveSortable>)[key]
): T[] {
  const optionSchema = z.object({
    key: keySchema,
    order: sortOrderSchema.optional(),
    limit: sortBaseOptionSchema.shape.limit,
  });

  const option = optionSchema.parse(input) as { key: K; order?: 'asc' | 'desc'; limit?: number };
  const order = option.order ?? 'desc';

  const sorted = [...items].sort((a, b) => {
    const result = comparePrimitive(getValue(a, option.key), getValue(b, option.key));
    return order === 'asc' ? result : -result;
  });

  return option.limit ? sorted.slice(0, option.limit) : sorted;
}
