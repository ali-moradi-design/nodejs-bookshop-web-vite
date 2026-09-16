import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useClearCartMutation } from '../model/use-clear-cart-mutation';

export function ClearCartButton() {
  const { t } = useTranslation();
  const clearMut = useClearCartMutation();

  return (
    <Button
      variant="outline"
      className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => clearMut.mutate()}
      disabled={clearMut.isPending}
    >
      {t('cart.clear')}
    </Button>
  );
}
