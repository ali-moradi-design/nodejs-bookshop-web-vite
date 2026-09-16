import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAddToCartMutation } from '../model/use-add-to-cart-mutation';

type Props = {
  bookId: string;
  disabled?: boolean;
  quantity?: number;
};

export function AddToCartButton({ bookId, disabled, quantity = 1 }: Props) {
  const { t } = useTranslation();
  const addToCart = useAddToCartMutation(bookId, quantity);

  return (
    <Button onClick={() => addToCart.mutate()} disabled={disabled || addToCart.isPending}>
      <ShoppingCart /> {t('book.addToCart')}
    </Button>
  );
}
