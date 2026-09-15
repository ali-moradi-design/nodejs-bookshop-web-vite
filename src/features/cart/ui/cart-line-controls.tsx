import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cartKeys, removeCartItem, updateCartItem } from '@/entities/cart';
import { ApiError } from '@/shared/api';
import { Button, Input } from '@/shared/ui';

type Props = {
  bookId: string;
  quantity: number;
};

export function CartLineControls({ bookId, quantity }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const updateMut = useMutation({
    mutationFn: (next: number) => updateCartItem(bookId, next),
    onSuccess: () => void qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const removeMut = useMutation({
    mutationFn: () => removeCartItem(bookId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-20"
        type="number"
        min={1}
        defaultValue={quantity}
        onBlur={(e) => {
          const q = Number(e.target.value);
          if (q >= 1 && q !== quantity) updateMut.mutate(q);
        }}
      />
      <Button variant="ghost" size="sm" onClick={() => removeMut.mutate()}>
        {t('cart.remove')}
      </Button>
    </div>
  );
}
