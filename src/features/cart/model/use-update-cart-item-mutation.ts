import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cartKeys, updateCartItem } from '@/entities/cart';
import { ApiError } from '@/shared/api';

export function useUpdateCartItemMutation(bookId: string) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (next: number) => updateCartItem(bookId, next),
    onSuccess: () => void qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
