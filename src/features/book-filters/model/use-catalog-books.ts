import { useEffect, useMemo, useState } from 'react';
import { useBooksQuery, type Book } from '@/entities/book';
import type { useBookFilters } from './use-book-filters';

type Filters = ReturnType<typeof useBookFilters>;

export function useCatalogBooks(filters: Filters) {
  const [accumulated, setAccumulated] = useState<Book[]>([]);

  const filterSig = useMemo(
    () =>
      [
        filters.params.q ?? '',
        filters.params.category ?? '',
        filters.params.minPrice ?? '',
        filters.params.maxPrice ?? '',
        filters.params.inStock ?? '',
        filters.params.sort ?? '',
        filters.params.order ?? '',
        filters.params.limit ?? '',
      ].join('\0'),
    [filters.params],
  );

  const query = useBooksQuery(filters.params);

  useEffect(() => {
    setAccumulated([]);
  }, [filterSig]);

  useEffect(() => {
    if (!query.data?.data) return;
    setAccumulated((prev) => {
      if (filters.page <= 1) return query.data.data;
      const seen = new Set(prev.map((b) => b.id));
      const next = query.data.data.filter((b) => !seen.has(b.id));
      return [...prev, ...next];
    });
  }, [query.data, filters.page]);

  const books = accumulated.length > 0 ? accumulated : (query.data?.data ?? []);
  const meta = query.data?.meta;
  const hasMore = meta ? filters.page < meta.pages : false;

  return {
    books,
    meta,
    hasMore,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
