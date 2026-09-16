import { useQueries } from '@tanstack/react-query';
import { bookKeys, fetchBook } from './book-api';

type Options = {
  enabled?: boolean;
};

/** Parallel book detail queries for cart line items. */
export function useCartBooksQueries(bookIds: string[], options: Options = {}) {
  const { enabled = true } = options;
  return useQueries({
    queries: bookIds.map((bookId) => ({
      queryKey: bookKeys.detail(bookId),
      queryFn: async () => (await fetchBook(bookId)).data,
      enabled: enabled && Boolean(bookId),
    })),
  });
}
