import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchFeaturedBooks } from '@/entities/book';
import { BookGrid } from '@/widgets/book-grid';
import { Alert, Button, PageLoader, EmptyState } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function HomePage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: bookKeys.featured(),
    queryFn: async () => (await fetchFeaturedBooks()).data,
  });

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/30 p-8 md:p-12">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{t('home.heroSubtitle')}</p>
        <Button asChild className="mt-6">
          <Link to="/catalog">{t('home.browseAll')}</Link>
        </Button>
      </section>

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
