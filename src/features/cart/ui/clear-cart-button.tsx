import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useClearCartMutation } from '../model/use-clear-cart-mutation';

export function ClearCartButton() {
  const { t } = useTranslation();
  const clearMut = useClearCartMutation();

  return (
    <Button variant="outline" onClick={() => clearMut.mutate()} disabled={clearMut.isPending}>
      {t('cart.clear')}
    </Button>
  );
}
