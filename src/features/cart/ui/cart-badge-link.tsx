import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cartKeys, fetchCart } from '@/entities/cart';
import { Button } from '@/shared/ui';

type Props = {
  /** When false, skip cart fetch (guest). */
  enabled?: boolean;
};

export function CartBadgeLink({ enabled = true }: Props) {
  const { t } = useTranslation();

  const cartQuery = useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => (await fetchCart()).data,
    enabled,
  });

  const count =
    enabled && cartQuery.data
      ? cartQuery.data.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
  const label = count > 0 ? t('nav.cartWithCount', { count }) : t('nav.cart');

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/cart" aria-label={label}>
        <ShoppingCart />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
