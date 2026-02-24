import { apiInstance, type ApiOptions } from './instance';
import {
  alcoholDetailSchema,
  alcoholListResponseSchema,
  alcoholRecommendationsSchema,
  type AlcoholDetail,
  type AlcoholListResponse,
} from '@/schema/api/alcohol';

export async function getAlcoholDetail(id: number, options?: ApiOptions): Promise<AlcoholDetail> {
  const response = await apiInstance.get(`alcohols/${id}`, options).json<unknown>();
  return alcoholDetailSchema.parse(response);
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchAlcoholListByUrl(url: URL): Promise<AlcoholListResponse> {
  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    redirect: 'manual',
  });

  if (!response.ok) {
    throw new Error(`Alcohol list request failed: ${response.status}`);
  }

  const json = await response.json();
  return alcoholListResponseSchema.parse(json);
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
  const url = new URL('/api/v1/alcohols/search', API_BASE_URL);
  url.searchParams.set('page', String(merged.page));
  url.searchParams.set('size', String(merged.size));
  url.searchParams.set('sort', merged.sort);
  url.searchParams.set('query', merged.query);
  url.searchParams.set('category', merged.category);
  url.searchParams.set('location', merged.location);
  url.searchParams.set('style', merged.style);
  url.searchParams.set('priceMin', String(merged.priceMin));
  url.searchParams.set('priceMax', String(merged.priceMax));
  url.searchParams.set('rating', String(merged.rating));

  return fetchAlcoholListByUrl(url);
}

export async function getRecommendedAlcoholList(
  params: Pick<AlcoholListParams, 'page' | 'size'> = {}
): Promise<AlcoholListResponse> {
  const page = params.page ?? 1;
  const size = params.size ?? 9;
  const url = new URL('/api/v1/alcohols/recommend', API_BASE_URL);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));
  return fetchAlcoholListByUrl(url);
}

export async function getWishAlcoholList(
  params: Pick<AlcoholListParams, 'page' | 'size' | 'sort'> = {}
): Promise<AlcoholListResponse> {
  const page = params.page ?? 1;
  const size = params.size ?? 9;
  const sort = params.sort ?? 'CreatedAt';
  const url = new URL('/api/v1/wishes/', API_BASE_URL);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));
  url.searchParams.set('sort', sort);
  return fetchAlcoholListByUrl(url);
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
