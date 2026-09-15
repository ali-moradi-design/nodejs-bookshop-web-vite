import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { fetchOrders, orderKeys, type Order } from '@/entities/order';
import { DataTable } from '@/shared/ui';
import { formatMoney, formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Alert, Badge, Button, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function PanelOrdersPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const { data, isLoading, error } = useQuery({
    queryKey: orderKeys.list(),
    queryFn: async () => (await fetchOrders()).data,
  });

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <Link className="text-primary underline" to={`/panel/orders/${row.original.id}`}>
            {row.original.id.slice(-8)}
          </Link>
        ),
      },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
      },
      {
        accessorKey: 'totalAmount',
        header: 'Total',
        cell: ({ row }) => formatMoney(row.original.totalAmount, 'USD', locale),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatDate(row.original.createdAt, locale),
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <Button asChild size="sm" variant="outline">
            <Link to={`/panel/orders/${row.original.id}`}>{t('panel.orderDetail')}</Link>
          </Button>
        ),
      },
    ],
    [t, locale],
  );

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Alert variant="destructive">
        {error instanceof ApiError ? error.message : t('common.error')}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.orders')}</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
