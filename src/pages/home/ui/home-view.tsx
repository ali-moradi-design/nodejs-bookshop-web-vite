import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchFeaturedBooks } from '@/entities/book';
import { BookGrid } from '@/widgets/book-grid';
import { HomeHero } from '@/widgets/home-hero';
import { Alert, PageLoader, EmptyState } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function HomePage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: bookKeys.featured(),
    queryFn: async () => (await fetchFeaturedBooks()).data,
  });

  return (
    <div className="space-y-10">
      <HomeHero />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('home.featured')}</h2>
        {isLoading ? <PageLoader /> : null}
        {error ? (
          <Alert variant="destructive">
            {error instanceof ApiError ? error.message : t('common.error')}{' '}
            <button className="underline" onClick={() => void refetch()}>
              {t('common.retry')}
            </button>
          </Alert>
        ) : null}
        {!isLoading && !error && (!data || data.length === 0) ? (
          <EmptyState title={t('common.empty')} description={t('catalog.noResults')} />
        ) : null}
        {data && data.length > 0 ? <BookGrid books={data} /> : null}
      </section>
    </div>
  );
}
