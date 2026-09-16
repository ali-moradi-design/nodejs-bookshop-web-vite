import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { orderKeys, payOrder } from '@/entities/order';
import { ApiError } from '@/shared/api';

export function usePayOrderMutation(orderId: string) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => payOrder(orderId),
    onSuccess: () => {
      toast.success(t('panel.paymentSuccess'));
      void qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      void qc.invalidateQueries({ queryKey: orderKeys.list() });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
