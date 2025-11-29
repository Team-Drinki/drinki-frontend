import { apiInstance, type ApiOptions } from './instance';

export async function addWish(alcoholId: number, options?: ApiOptions): Promise<void> {
  await apiInstance.post(`wishes/${alcoholId}`, options);
}

export async function removeWish(alcoholId: number, options?: ApiOptions): Promise<void> {
  await apiInstance.delete(`wishes/${alcoholId}`, options);
}
