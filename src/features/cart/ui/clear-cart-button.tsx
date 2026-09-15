import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { cartKeys, clearCart } from '@/entities/cart';
import { Button } from '@/shared/ui';

export function ClearCartButton() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const clearMut = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => void qc.invalidateQueries({ queryKey: cartKeys.all }),
  });

  return (
    <Button variant="outline" onClick={() => clearMut.mutate()} disabled={clearMut.isPending}>
      {t('cart.clear')}
    </Button>
  );
}
