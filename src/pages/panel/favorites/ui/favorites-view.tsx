import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { favoriteKeys, fetchFavorites, removeFavorite } from '@/entities/favorite';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import { Alert, Button, EmptyState, PageLoader } from '@/shared/ui';

export function FavoritesPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
  });

  const remove = useMutation({
    mutationFn: (bookId: string) => removeFavorite(bookId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: favoriteKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
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
            <Button variant="outline" size="sm" onClick={() => remove.mutate(fav.bookId)}>
              {t('common.delete')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
