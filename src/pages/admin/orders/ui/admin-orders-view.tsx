import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  fetchOrders,
  orderKeys,
  ORDER_STATUSES,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from '@/entities/order';
import { DataTable } from '@/widgets/data-table';
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

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: orderKeys.list(),
    queryFn: async () => (await fetchOrders()).data,
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      void qc.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

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
