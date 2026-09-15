import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchBooks } from '@/entities/book';
import { BookFilters, useBookFilters } from '@/features/book-filters';
import { BookGrid } from '@/widgets/book-grid';
import { Alert, Button, EmptyState, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function CatalogPage() {
  const { t } = useTranslation();
  const filters = useBookFilters(12);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: bookKeys.list(filters.params),
    queryFn: () => fetchBooks(filters.params),
  });

  const books = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('catalog.title')}</h1>
      <BookFilters {...filters} />

      {isLoading ? <PageLoader /> : null}
      {error ? (
        <Alert variant="destructive">
          {error instanceof ApiError ? error.message : t('common.error')}{' '}
          <button className="underline" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {!isLoading && !error && books.length === 0 ? (
        <EmptyState title={t('catalog.noResults')} />
      ) : null}
      {books.length > 0 ? <BookGrid books={books} /> : null}

      {meta && meta.pages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={filters.page <= 1}
            onClick={() => filters.setPage((p) => p - 1)}
          >
            {t('common.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('common.page')} {meta.page} {t('common.of')} {meta.pages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page >= meta.pages}
            onClick={() => filters.setPage((p) => p + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
