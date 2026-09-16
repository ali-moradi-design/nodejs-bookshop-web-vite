import { useBooksQuery } from '@/entities/book';

type Options = {
  enabled?: boolean;
};

export function useBookSearchQuery(q: string, options: Options = {}) {
  const { enabled = true } = options;
  return useBooksQuery({ q, limit: 8, page: 1 }, { enabled: enabled && q.length > 0 });
}
