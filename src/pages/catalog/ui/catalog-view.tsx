import { useTranslation } from 'react-i18next';
import {
  ActiveFilterChips,
  BookFilters,
  useBookFilters,
  useCatalogBooks,
} from '@/features/book-filters';
import { BookGrid, BookGridSkeleton } from '@/widgets/book-grid';
import { Alert, Button, EmptyState } from '@/shared/ui';
import { ApiError } from '@/shared/api';
import { usePageTitle } from '@/shared/hooks';

export function CatalogPage() {
  const { t } = useTranslation();
  usePageTitle(t('catalog.title'));
  const filters = useBookFilters(12);
  const { books, hasMore, isLoading, isFetching, error, refetch } = useCatalogBooks(filters);

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
