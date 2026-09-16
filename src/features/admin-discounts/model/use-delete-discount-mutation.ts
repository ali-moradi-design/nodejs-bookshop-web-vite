import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { deleteDiscount, discountKeys } from '@/entities/discount';
import { ApiError } from '@/shared/api';

export function useDeleteDiscountMutation() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: () => {
      toast.success('Deleted');
      void qc.invalidateQueries({ queryKey: discountKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
