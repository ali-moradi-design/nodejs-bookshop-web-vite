import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage, ApiPaginated } from '@/shared/api';
import type {
  CreateReviewInput,
  Review,
  ReviewListParams,
  UpdateReviewInput,
} from '../model/types';

export const reviewKeys = {
  all: ['reviews'] as const,
  list: (params: ReviewListParams) => [...reviewKeys.all, 'list', params] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
};

export const fetchReviews = (params: ReviewListParams = {}) =>
  apiGet<ApiPaginated<Review> | ApiData<Review[]>>(
    '/reviews',
    params as Record<string, string | number | undefined>,
  );

export const createReview = (input: CreateReviewInput) =>
  apiPost<ApiData<Review>>('/reviews', input);

export const updateReview = (id: string, input: UpdateReviewInput) =>
  apiPatch<ApiData<Review>>(`/reviews/${id}`, input);

export const deleteReview = (id: string) => apiDelete<ApiMessage>(`/reviews/${id}`);
