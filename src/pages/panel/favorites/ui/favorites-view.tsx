import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { favoriteKeys, fetchFavorites } from '@/entities/favorite';
import { RemoveFavoriteButton } from '@/features/favorites';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import { Alert, EmptyState, PageLoader } from '@/shared/ui';

export function FavoritesPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const { data, isLoading, error } = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
  });

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Alert variant="destructive">
        {error instanceof ApiError ? error.message : t('common.error')}
      </Alert>
    );
  }
  if (!data?.length)
    return <EmptyState title={t('nav.favorites')} description={t('common.empty')} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.favorites')}</h1>
      <ul className="divide-y rounded-xl border bg-card">
        {data.map((fav) => (
          <li key={fav.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <Link
                to={`/books/${fav.bookId}`}
                className="font-medium text-primary hover:underline"
              >
                {fav.populated?.book?.title || fav.bookId}
              </Link>
              <p className="text-sm text-muted-foreground">
                {fav.populated?.book?.author}
                {fav.populated?.book?.price != null
                  ? ` · ${formatMoney(fav.populated.book.price, 'USD', locale)}`
                  : ''}
              </p>
            </div>
            <RemoveFavoriteButton bookId={fav.bookId} />
          </li>
        ))}
      </ul>
    </div>
  );
}
