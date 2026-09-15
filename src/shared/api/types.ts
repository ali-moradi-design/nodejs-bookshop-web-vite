export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiData<T> {
  data: T;
}

export interface ApiPaginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiMessage {
  message: string;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: unknown;
  statusCode?: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;
