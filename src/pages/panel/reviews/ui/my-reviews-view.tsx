import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { useReviewsQuery } from '@/entities/review';
import { LoveRating } from '@/features/reviews';
import { formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Alert, EmptyState, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function MyReviewsPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useReviewsQuery(
    { user: user?.id, limit: 100 },
    { enabled: Boolean(user?.id) },
  );

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Alert variant="destructive">
        {error instanceof ApiError ? error.message : t('common.error')}
      </Alert>
    );
  }
  if (!data?.length) return <EmptyState title={t('nav.reviews')} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.reviews')}</h1>
      <ul className="space-y-3">
        {data.map((r) => (
          <li key={r.id} className="rounded-xl border bg-card p-4">
            <div className="flex justify-between gap-3 text-sm">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-medium">{r.populated?.book?.title || r.book}</span>
                <LoveRating value={r.rating} readOnly size="sm" aria-label={t('book.rating')} />
              </div>
              <span className="shrink-0 text-muted-foreground">
                {formatDate(r.createdAt, locale)}
              </span>
            </div>
            {r.comment ? <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
