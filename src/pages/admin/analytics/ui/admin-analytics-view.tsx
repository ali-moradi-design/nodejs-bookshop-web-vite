import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '@/shared/ui';

const AdminCharts = lazy(() =>
  import('@/widgets/admin-charts').then((m) => ({ default: m.AdminCharts })),
);

export function AdminAnalyticsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.analytics')}</h1>
      <Suspense fallback={<PageLoader />}>
        <AdminCharts />
      </Suspense>
    </div>
  );
}
