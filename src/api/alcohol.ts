import { apiInstance, type ApiOptions } from './instance';
import { alcoholDetailSchema, type AlcoholDetail } from '@/schema/api/alcohol';

export async function getAlcoholDetail(id: number, options?: ApiOptions): Promise<AlcoholDetail> {
  const response = await apiInstance.get(`alcohols/${id}`, options).json<unknown>();
  return alcoholDetailSchema.parse(response);
}
