import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/shared/ui';
import { useUpdateCartItemMutation } from '../model/use-update-cart-item-mutation';
import { useRemoveCartItemMutation } from '../model/use-remove-cart-item-mutation';

type Props = {
  bookId: string;
  quantity: number;
};

export function CartLineControls({ bookId, quantity }: Props) {
  const { t } = useTranslation();
  const updateMut = useUpdateCartItemMutation(bookId);
  const removeMut = useRemoveCartItemMutation(bookId);

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
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => removeMut.mutate()}
        disabled={removeMut.isPending}
      >
        {t('cart.remove')}
      </Button>
    </div>
  );
}
