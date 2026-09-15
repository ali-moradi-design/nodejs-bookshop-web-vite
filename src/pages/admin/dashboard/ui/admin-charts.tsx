import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrdersByStatus, fetchRevenue, fetchTopBooks, reportKeys } from '@/entities/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';

export function AdminCharts() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);

  const revenueQ = useQuery({
    queryKey: reportKeys.revenue(),
    queryFn: async () => (await fetchRevenue()).data,
  });
  const statusQ = useQuery({
    queryKey: reportKeys.ordersByStatus(),
    queryFn: async () => (await fetchOrdersByStatus()).data,
  });
  const topQ = useQuery({
    queryKey: reportKeys.topBooks(),
    queryFn: async () => (await fetchTopBooks()).data,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.revenue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatMoney(Number(revenueQ.data?.totalRevenue ?? 0), 'USD', locale)}
          </p>
          <p className="text-sm text-muted-foreground">
            Orders: {String(revenueQ.data?.orderCount ?? '—')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {(statusQ.data ?? []).map((row, i) => (
            <div key={i} className="flex justify-between">
              <span>{row.status}</span>
              <span className="font-medium">{row.count}</span>
            </div>
          ))}
          {!statusQ.data?.length ? (
            <p className="text-muted-foreground">{t('common.empty')}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top books</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {(topQ.data ?? []).slice(0, 5).map((row, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span className="truncate">{String(row.title ?? row.bookId ?? i)}</span>
              <span className="shrink-0 font-medium">{row.quantity ?? row.revenue ?? '—'}</span>
            </div>
          ))}
          {!topQ.data?.length ? <p className="text-muted-foreground">{t('common.empty')}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
