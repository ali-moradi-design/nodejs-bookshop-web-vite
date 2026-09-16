import { useQuery } from '@tanstack/react-query';
import { bookKeys, fetchBooks } from './book-api';
import type { BookListParams } from '../model/types';

type Options = {
  enabled?: boolean;
};

export function useBooksQuery(params: BookListParams = {}, options: Options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => fetchBooks(params),
    enabled,
  });
}
