import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cartKeys, removeCartItem } from '@/entities/cart';
import { ApiError } from '@/shared/api';

export function useRemoveCartItemMutation(bookId: string) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => removeCartItem(bookId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
