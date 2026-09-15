import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  adminKeys,
  fetchDashboardSummary,
  fetchLowStock,
  fetchRecentOrders,
} from '@/entities/admin';
import { KpiCards } from '@/widgets/kpi-cards';
import { formatMoney, formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

const AdminCharts = lazy(() => import('./admin-charts').then((m) => ({ default: m.AdminCharts })));

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);

  const summaryQ = useQuery({
    queryKey: adminKeys.summary(),
    queryFn: async () => (await fetchDashboardSummary()).data,
  });
  const recentQ = useQuery({
    queryKey: adminKeys.recentOrders(8),
    queryFn: async () => (await fetchRecentOrders(8)).data,
  });
  const lowQ = useQuery({
    queryKey: adminKeys.lowStock(5),
    queryFn: async () => (await fetchLowStock(5)).data,
  });

  if (summaryQ.isLoading) return <PageLoader />;
  if (summaryQ.error) {
    return (
      <Alert variant="destructive">
        {summaryQ.error instanceof ApiError ? summaryQ.error.message : t('common.error')}
      </Alert>
    );
  }

  const s = summaryQ.data!;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.summary')}</h1>
      <KpiCards
        items={[
          { label: t('nav.users'), value: s.users },
          { label: t('nav.books'), value: s.books },
          { label: t('nav.orders'), value: s.orders },
          { label: t('admin.revenue'), value: formatMoney(s.revenue, 'USD', locale) },
          { label: t('admin.openIssues'), value: s.openIssueReports },
          { label: t('admin.lowStock'), value: s.lowStock },
        ]}
      />
      <Suspense fallback={<PageLoader />}>
        <AdminCharts />
      </Suspense>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.recentOrders')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(recentQ.data ?? []).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="font-mono">{o.id.slice(-8)}</span>
                <Badge variant="secondary">{o.status}</Badge>
                <span>{formatMoney(o.totalAmount, 'USD', locale)}</span>
                <span className="text-muted-foreground">{formatDate(o.createdAt, locale)}</span>
              </div>
            ))}
            {!recentQ.data?.length ? (
              <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.lowStock')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(lowQ.data ?? []).map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <span>{b.title}</span>
                <Badge variant="destructive">{b.stock}</Badge>
              </div>
            ))}
            {!lowQ.data?.length ? (
              <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
