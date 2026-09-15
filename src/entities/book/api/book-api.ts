import { apiDelete, apiGet, apiPatch, apiPost, apiUpload } from '@/shared/api';
import type { ApiData, ApiMessage, ApiPaginated } from '@/shared/api';
import type { Book, BookListParams, CreateBookInput, UpdateBookInput } from '../model/types';

export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (params: BookListParams) => [...bookKeys.lists(), params] as const,
  featured: () => [...bookKeys.all, 'featured'] as const,
  detail: (id: string) => [...bookKeys.all, 'detail', id] as const,
};

export const fetchBooks = (params: BookListParams = {}) =>
  apiGet<ApiPaginated<Book>>(
    '/books',
    params as Record<string, string | number | boolean | undefined>,
  );

export const fetchFeaturedBooks = () => apiGet<ApiData<Book[]>>('/books/featured');

export const fetchBook = (id: string) => apiGet<ApiData<Book>>(`/books/${id}`);

export const createBook = (input: CreateBookInput) => apiPost<ApiData<Book>>('/books', input);

export const updateBook = (id: string, input: UpdateBookInput) =>
  apiPatch<ApiData<Book>>(`/books/${id}`, input);

export const deleteBook = (id: string) => apiDelete<ApiMessage>(`/books/${id}`);

export const uploadBookCover = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return apiUpload<{ url: string }>('/uploads/book-cover', fd);
};
