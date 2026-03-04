import ky, { HTTPError, type Options as KyOptions } from 'ky';
import { apiErrorSchema } from '@/schema/api/error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiInstance = ky.create({
  prefixUrl: `${API_BASE_URL}/api/v1`,
  credentials: 'include',
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      request => {
        const method = request.method.toUpperCase();
        const isBodylessMethod = method === 'GET' || method === 'HEAD';
        const hasBody = request.body !== null;

        if (isBodylessMethod || !hasBody) {
          request.headers.delete('Content-Type');
          return;
        }

        if (!request.headers.has('Content-Type')) {
          request.headers.set('Content-Type', 'application/json');
        }
      },
    ],
    beforeError: [
      async error => {
        const { response } = error;

        if (response && error instanceof HTTPError) {
          const contentType = response.headers.get('content-type') || '';
          const isJsonResponse = contentType.includes('application/json');

          if (isJsonResponse) {
            try {
              const body = await response.clone().json();
              const parsed = apiErrorSchema.safeParse(body);

              if (parsed.success) {
                error.message = parsed.data.message || error.message;
              }
            } catch {}
          }
        }

        return error;
      },
    ],
  },
});

export type ApiOptions = Omit<KyOptions, 'prefixUrl'>;
