import { apiInstance, type ApiOptions } from './instance';
import {
  alcoholDetailSchema,
  alcoholListResponseSchema,
  alcoholRecommendationsSchema,
  AlcoholRecommendation,
  type AlcoholDetail,
  type AlcoholListResponse,
} from '@/schema/api/alcohol';

export async function getAlcoholDetail(id: number, options?: ApiOptions): Promise<AlcoholDetail> {
  const { data } = await apiInstance.get<unknown>(`alcohols/${id}`, options);
  return alcoholDetailSchema.parse(data);
}

async function fetchAlcoholList(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<AlcoholListResponse> {
  const { data } = await apiInstance.get<unknown>(path, { params });
  return alcoholListResponseSchema.parse(data);
}

export interface AlcoholListParams {
  page?: number;
  size?: number;
  sort?: 'CreatedAt' | 'View' | 'TastingNote' | 'Like' | 'Rating' | 'PriceDesc' | 'PriceAsc';
  query?: string;
  categoryId?: number;
  category?: string;
  location?: string;
  style?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
}

function mapSortToBackend(sort: AlcoholListParams['sort']): string {
  switch (sort) {
    case 'View':
      return 'viewCnt:desc';
    case 'Like':
      return 'wishCnt:desc';
    case 'Rating':
      return 'rating:desc';
    case 'PriceAsc':
      return 'price:asc';
    case 'PriceDesc':
      return 'price:desc';
    case 'TastingNote':
      return 'createdAt:desc';
    case 'CreatedAt':
    default:
      return 'createdAt:desc';
  }
}

export async function getAlcoholList(params: AlcoholListParams = {}): Promise<AlcoholListResponse> {
  const page = params.page ?? 1;
  const size = params.size ?? 9;
  const sort = params.sort ?? 'CreatedAt';
  const query = params.query?.trim();

  return fetchAlcoholList('alcohols/search', {
    page,
    size,
    sort: mapSortToBackend(sort),
    query: query ? query : undefined,
    categoryId: params.categoryId && params.categoryId > 0 ? params.categoryId : undefined,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    rating: params.rating,
  });
}

export async function getRecommendedAlcoholList(
  params: Pick<AlcoholListParams, 'page' | 'size'> = {}
): Promise<AlcoholListResponse> {
  const page = params.page ?? 1;
  const size = params.size ?? 9;
  return fetchAlcoholList('alcohols/recommend', { page, size });
}

export async function getWishAlcoholList(
  params: Pick<AlcoholListParams, 'page' | 'size' | 'sort'> = {}
): Promise<AlcoholListResponse> {
  const page = params.page ?? 1;
  const size = params.size ?? 9;
  const sort = params.sort ?? 'CreatedAt';
  return fetchAlcoholList('wishes/', { page, size, sort });
}

export async function getAlcoholRecommendations(
  limit = 3,
  options?: ApiOptions
): Promise<AlcoholRecommendation[]> {
  const { data } = await apiInstance.get<unknown>('alcohols/recommend', {
    ...options,
    params: { limit },
  });
  return alcoholRecommendationsSchema.parse(data).recommendations;
}
