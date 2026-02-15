import { apiInstance, type ApiOptions } from './instance';
import {
  alcoholDetailSchema,
  alcoholRecommendationsSchema,
  type AlcoholDetail,
  type AlcoholRecommendation,
} from '@/schema/api/alcohol';

export async function getAlcoholDetail(id: number, options?: ApiOptions): Promise<AlcoholDetail> {
  const response = await apiInstance.get(`alcohols/${id}`, options).json<unknown>();
  return alcoholDetailSchema.parse(response);
}

export async function getAlcoholRecommendations(
  limit = 3,
  options?: ApiOptions
): Promise<AlcoholRecommendation[]> {
  const response = await apiInstance
    .get('alcohols/recommend', {
      ...options,
      searchParams: { limit },
    })
    .json<unknown>();

  return alcoholRecommendationsSchema.parse(response).recommendations;
}
