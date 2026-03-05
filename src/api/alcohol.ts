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
  params: Record<string, string | number>
): Promise<AlcoholListResponse> {
  const { data } = await apiInstance.get<unknown>(path, { params });
  return alcoholListResponseSchema.parse(data);
}

export interface AlcoholListParams {
  page?: number;
  size?: number;
  sort?: 'CreatedAt' | 'View' | 'TastingNote' | 'Like' | 'Rating' | 'PriceDesc' | 'PriceAsc';
  query?: string;
  category?: string;
  location?: string;
  style?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
}

const defaultAlcoholListParams: Required<AlcoholListParams> = {
  page: 1,
  size: 9,
  sort: 'CreatedAt',
  query: '',
  category: '',
  location: '',
  style: '',
  priceMin: 0,
  priceMax: 1000000000,
  rating: 0,
};

export async function getAlcoholList(params: AlcoholListParams = {}): Promise<AlcoholListResponse> {
  const merged = { ...defaultAlcoholListParams, ...params };
  return fetchAlcoholList('alcohols/search', {
    page: merged.page,
    size: merged.size,
    sort: merged.sort,
    query: merged.query,
    category: merged.category,
    location: merged.location,
    style: merged.style,
    priceMin: merged.priceMin,
    priceMax: merged.priceMax,
    rating: merged.rating,
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
