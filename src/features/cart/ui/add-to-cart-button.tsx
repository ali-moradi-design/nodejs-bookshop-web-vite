import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { addCartItem, cartKeys } from '@/entities/cart';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui';

type Props = {
  bookId: string;
  disabled?: boolean;
  quantity?: number;
};

export function AddToCartButton({ bookId, disabled, quantity = 1 }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const addToCart = useMutation({
    mutationFn: () => addCartItem(bookId, quantity),
    onSuccess: () => {
      toast.success('Added to cart');
      void qc.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <Button onClick={() => addToCart.mutate()} disabled={disabled || addToCart.isPending}>
      <ShoppingCart /> {t('book.addToCart')}
    </Button>
  );
}
