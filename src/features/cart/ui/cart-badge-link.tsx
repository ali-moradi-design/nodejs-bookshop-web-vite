import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cartKeys, fetchCart } from '@/entities/cart';
import { bookKeys, fetchBook } from '@/entities/book';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Skeleton,
} from '@/shared/ui';
import { CartLineControls } from './cart-line-controls';

type Props = {
  /** When false, skip cart fetch (guest). */
  enabled?: boolean;
};

function useSheetSide(): 'left' | 'right' {
  const locale = usePreferences((s) => s.locale);
  if (typeof document !== 'undefined') {
    const dir = document.documentElement.dir || (locale === 'fa' ? 'rtl' : 'ltr');
    return dir === 'rtl' ? 'left' : 'right';
  }
  return locale === 'fa' ? 'left' : 'right';
}

export function CartBadgeLink({ enabled = true }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const side = useSheetSide();
  const locale = usePreferences((s) => s.locale);
  const canFetch = enabled;

  const cartQuery = useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => (await fetchCart()).data,
    enabled: canFetch,
  });

  const items = cartQuery.data?.items ?? [];
  const bookQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: bookKeys.detail(item.bookId),
      queryFn: async () => (await fetchBook(item.bookId)).data,
      enabled: canFetch && open,
    })),
  });

  const count = canFetch ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const label = count > 0 ? t('nav.cartWithCount', { count }) : t('nav.cart');

  const rows = useMemo(
    () =>
      items.map((item, i) => {
        const book = bookQueries[i]?.data;
        const line = (book?.price ?? 0) * item.quantity;
        return { item, book, line, loading: bookQueries[i]?.isLoading };
      }),
    [items, bookQueries],
  );
  const subtotal = rows.reduce((sum, row) => sum + row.line, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        <ShoppingCart />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </Button>

      <SheetContent side={side} className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('cart.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('cart.title')}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {!enabled ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">{t('cart.loginHint')}</p>
              <SheetClose asChild>
                <Button asChild size="sm">
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
              </SheetClose>
            </div>
          ) : cartQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : items.length === 0 ? (
            <div className="space-y-3 text-sm">
              <p className="font-medium">{t('cart.empty')}</p>
              <p className="text-muted-foreground">{t('cart.emptyHint')}</p>
              <SheetClose asChild>
                <Button asChild size="sm" variant="outline">
                  <Link to="/catalog">{t('nav.catalog')}</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="space-y-4">
              {rows.map(({ item, book, line, loading }) => (
                <li
                  key={item.bookId}
                  className="space-y-2 border-b border-border pb-3 last:border-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {loading ? '…' : (book?.title ?? item.bookId)}
                      </p>
                      {book?.author ? (
                        <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {formatMoney(line, book?.currency || 'USD', locale)}
                    </p>
                  </div>
                  <CartLineControls bookId={item.bookId} quantity={item.quantity} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {enabled && items.length > 0 ? (
          <div className="border-t pt-3 text-sm font-semibold">
            {t('cart.subtotal')}: {formatMoney(subtotal, 'USD', locale)}
          </div>
        ) : null}

        <SheetFooter className="mt-4 gap-2 sm:flex-col sm:space-x-0">
          <SheetClose asChild>
            <Button asChild variant="outline" className="w-full">
              <Link to="/cart">{t('cart.viewCart')}</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild className="w-full" disabled={!enabled || items.length === 0}>
              <Link to="/checkout">{t('cart.checkout')}</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
