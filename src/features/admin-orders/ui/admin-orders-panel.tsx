import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useOrdersQuery, ORDER_STATUSES, type Order, type OrderStatus } from '@/entities/order';
import { DataTable } from '@/shared/ui';
import { formatMoney, formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import {
  Alert,
  Badge,
  PageLoader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { useUpdateOrderStatusMutation } from '../model/use-update-order-status-mutation';

export function AdminOrdersPanel() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const { data, isLoading, error } = useOrdersQuery();
  const update = useUpdateOrderStatusMutation();

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(-10)}</span>,
      },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(v) => update.mutate({ id: row.original.id, status: v as OrderStatus })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: 'payment',
        header: 'Payment',
        cell: ({ row }) => <Badge variant="outline">{row.original.payment.status}</Badge>,
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
    ],
    [t, locale, update],
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
      <h1 className="text-2xl font-bold">{t('admin.manageOrders')}</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
