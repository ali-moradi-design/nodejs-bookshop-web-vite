import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { orderKeys, updateOrderStatus, type OrderStatus } from '@/entities/order';
import { ApiError } from '@/shared/api';

export function useUpdateOrderStatusMutation() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      void qc.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
