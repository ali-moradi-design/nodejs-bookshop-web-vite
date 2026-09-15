import { useTranslation } from 'react-i18next';
import type { Review } from '@/entities/review';
import { formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { EmptyState } from '@/shared/ui';

type Props = { reviews: Review[] };

export function ReviewList({ reviews }: Props) {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);

  if (reviews.length === 0) return <EmptyState title={t('common.empty')} />;

  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {r.populated?.user?.name || 'User'} · ★ {r.rating}
            </span>
            <span className="text-muted-foreground">{formatDate(r.createdAt, locale)}</span>
          </div>
          {r.comment ? <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p> : null}
        </li>
      ))}
    </ul>
  );
}
