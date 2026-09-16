import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useFeaturedBooksQuery } from '@/entities/book';
import { BookGrid, BookGridSkeleton } from '@/widgets/book-grid';
import { HomeHero } from '@/widgets/home-hero';
import { RecentlyViewedSection } from '@/widgets/recently-viewed';
import { Alert, EmptyState } from '@/shared/ui';
import { ApiError } from '@/shared/api';
import { usePageTitle } from '@/shared/hooks';

export function HomePage() {
  const { t } = useTranslation();
  usePageTitle(t('nav.home'));
  const { data, isLoading, error, refetch } = useFeaturedBooksQuery();

  return (
    <div className="space-y-10">
      <HomeHero />

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          className="text-xl font-semibold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {t('home.featured')}
        </motion.h2>
        {isLoading ? <BookGridSkeleton count={5} /> : null}
        {error ? (
          <Alert variant="destructive">
            {error instanceof ApiError ? error.message : t('common.error')}{' '}
            <button type="button" className="underline" onClick={() => void refetch()}>
              {t('common.retry')}
            </button>
          </Alert>
        ) : null}
        {!isLoading && !error && (!data || data.length === 0) ? (
          <EmptyState title={t('common.empty')} description={t('catalog.noResults')} />
        ) : null}
        {data && data.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-20px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <BookGrid books={data} withFavorites />
            </motion.div>
          </motion.div>
        ) : null}
      </motion.section>

      <RecentlyViewedSection />
    </div>
  );
}
