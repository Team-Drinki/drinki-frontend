import ky, { HTTPError, type Options as KyOptions } from 'ky';
import { apiErrorSchema } from '@/schema/api/error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiInstance = ky.create({
  prefixUrl: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      async error => {
        const { response } = error;

        if (response && error instanceof HTTPError) {
          try {
            const body = await response.json();
            const parsed = apiErrorSchema.safeParse(body);

            if (parsed.success) {
              error.message = parsed.data.message || error.message;
            }
          } catch {}
        }

        return error;
      },
    ],
  },
});

export type ApiOptions = Omit<KyOptions, 'prefixUrl'>;
