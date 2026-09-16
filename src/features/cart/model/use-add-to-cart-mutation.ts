import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { addCartItem, cartKeys, type Cart } from '@/entities/cart';
import { ApiError } from '@/shared/api';

export function useAddToCartMutation(bookId: string, quantity = 1) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => addCartItem(bookId, quantity),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: cartKeys.all });
      const previous = qc.getQueryData<Cart>(cartKeys.current());
      qc.setQueryData<Cart>(cartKeys.current(), (old) => {
        if (!old) {
          return {
            id: 'optimistic',
            userId: '',
            items: [{ bookId, quantity }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        const existing = old.items.find((i) => i.bookId === bookId);
        const items = existing
          ? old.items.map((i) =>
              i.bookId === bookId ? { ...i, quantity: i.quantity + quantity } : i,
            )
          : [...old.items, { bookId, quantity }];
        return { ...old, items };
      });
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(t('toast.addedToCart'));
      if (res?.data) qc.setQueryData(cartKeys.current(), res.data);
    },
    onError: (e, _v, ctx) => {
      if (ctx?.previous !== undefined) qc.setQueryData(cartKeys.current(), ctx.previous);
      toast.error(e instanceof ApiError ? e.message : t('common.error'));
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
