import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBooksQuery, type Book } from '@/entities/book';
import { BookFilters, useBookFilters } from '@/features/book-filters';
import { BookGrid, BookGridSkeleton } from '@/widgets/book-grid';
import { Alert, Button, EmptyState } from '@/shared/ui';
import { ApiError } from '@/shared/api';
import { usePageTitle } from '@/shared/hooks';

export function CatalogPage() {
  const { t } = useTranslation();
  usePageTitle(t('catalog.title'));
  const filters = useBookFilters(12);
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

  const { data, isLoading, isFetching, error, refetch } = useBooksQuery(filters.params);

  useEffect(() => {
    setAccumulated([]);
  }, [filterSig]);

  useEffect(() => {
    if (!data?.data) return;
    setAccumulated((prev) => {
      if (filters.page <= 1) return data.data;
      const seen = new Set(prev.map((b) => b.id));
      const next = data.data.filter((b) => !seen.has(b.id));
      return [...prev, ...next];
    });
  }, [data, filters.page]);

  const books = accumulated.length > 0 ? accumulated : (data?.data ?? []);
  const meta = data?.meta;
  const hasMore = meta ? filters.page < meta.pages : false;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('catalog.title')}</h1>
      <BookFilters {...filters} />
      <ActiveFilterChips filters={filters} />

      {isLoading && filters.page <= 1 ? <BookGridSkeleton count={12} /> : null}
      {error ? (
        <Alert variant="destructive">
          {error instanceof ApiError ? error.message : t('common.error')}{' '}
          <button type="button" className="underline" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {!isLoading && !error && books.length === 0 ? (
        <EmptyState
          title={t('catalog.noResults')}
          action={
            <Button type="button" variant="outline" onClick={filters.resetFilters}>
              {t('catalog.clearFilters')}
            </Button>
          }
        />
      ) : null}
      {books.length > 0 ? <BookGrid books={books} withFavorites /> : null}

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => filters.setPage((p) => p + 1)}
          >
            {t('catalog.loadMore')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ActiveFilterChips({ filters }: { filters: ReturnType<typeof useBookFilters> }) {
  const { t } = useTranslation();
  const chips: { key: string; label: string; clear: () => void }[] = [];

  if (filters.params.q) {
    chips.push({
      key: 'q',
      label: `${t('catalog.query')}: ${filters.params.q}`,
      clear: () => filters.removeFilterParam('q'),
    });
  }
  if (filters.params.category) {
    chips.push({
      key: 'category',
      label: `${t('catalog.category')}: ${filters.params.category}`,
      clear: () => filters.removeFilterParam('category'),
    });
  }
  if (filters.params.minPrice != null) {
    chips.push({
      key: 'minPrice',
      label: `${t('catalog.from')}: ${filters.params.minPrice}`,
      clear: () => filters.removeFilterParam('minPrice'),
    });
  }
  if (filters.params.maxPrice != null) {
    chips.push({
      key: 'maxPrice',
      label: `${t('catalog.to')}: ${filters.params.maxPrice}`,
      clear: () => filters.removeFilterParam('maxPrice'),
    });
  }
  if (filters.params.inStock) {
    chips.push({
      key: 'inStock',
      label: t('catalog.inStock'),
      clear: () => filters.removeFilterParam('inStock'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t('catalog.activeFilters')}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-1 text-xs hover:bg-muted"
        >
          {chip.label}
          <span aria-hidden className="opacity-60">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
