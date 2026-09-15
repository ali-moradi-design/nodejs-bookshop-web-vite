import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { fetchReviews, reviewKeys } from '@/entities/review';
import { formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Alert, EmptyState, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function MyReviewsPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useQuery({
    queryKey: reviewKeys.list({ user: user?.id }),
    queryFn: async () => {
      const res = await fetchReviews({ user: user?.id, limit: 100 });
      return Array.isArray((res as { data: unknown }).data)
        ? (res as { data: import('@/entities/review').Review[] }).data
        : [];
    },
    enabled: Boolean(user?.id),
  });

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
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {r.populated?.book?.title || r.book} · ★ {r.rating}
              </span>
              <span className="text-muted-foreground">{formatDate(r.createdAt, locale)}</span>
            </div>
            {r.comment ? <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
