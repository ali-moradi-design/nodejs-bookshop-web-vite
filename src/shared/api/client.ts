import { API_V1, API_URL } from '@/shared/config';
import { ApiError, type ApiErrorBody, type QueryParams } from './types';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: QueryParams;
  /** Skip refresh retry (used internally for /auth/refresh). */
  skipRefresh?: boolean;
  /** Absolute path under API_URL, e.g. /api/health. Default prefixes /api/v1. */
  absolutePath?: string;
  signal?: AbortSignal;
}

let refreshPromise: Promise<boolean> | null = null;

const buildUrl = (path: string, params?: QueryParams, absolutePath?: string): string => {
  const base = absolutePath
    ? `${API_URL}${absolutePath.startsWith('/') ? absolutePath : `/${absolutePath}`}`
    : `${API_V1}${path.startsWith('/') ? path : `/${path}`}`;
  if (!params) return base;
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
};

const parseBody = async (res: Response): Promise<unknown> => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
};

const tryRefresh = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_V1}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    skipRefresh = false,
    absolutePath,
    signal,
  } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const reqHeaders: Record<string, string> = { ...headers };
  if (body !== undefined && !isFormData) {
    reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json';
  }

  const res = await fetch(buildUrl(path, params, absolutePath), {
    method,
    credentials: 'include',
    headers: reqHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    signal,
  });

  if (res.status === 401 && !skipRefresh && !path.includes('/auth/')) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
  }

  const parsed = (await parseBody(res)) as ApiErrorBody | T | null;

  if (!res.ok) {
    const errBody = (parsed || {}) as ApiErrorBody;
    const message = errBody.message || errBody.error || `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, errBody);
  }

  return parsed as T;
};

export const apiGet = <T>(path: string, params?: QueryParams, opts?: RequestOptions) =>
  apiRequest<T>(path, { ...opts, method: 'GET', params });

export const apiPost = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  apiRequest<T>(path, { ...opts, method: 'POST', body });

export const apiPatch = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  apiRequest<T>(path, { ...opts, method: 'PATCH', body });

export const apiDelete = <T>(path: string, opts?: RequestOptions) =>
  apiRequest<T>(path, { ...opts, method: 'DELETE' });

export const apiUpload = <T>(path: string, formData: FormData, opts?: RequestOptions) =>
  apiRequest<T>(path, { ...opts, method: 'POST', body: formData });
