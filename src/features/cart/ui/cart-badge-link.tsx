import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartQuery } from '@/entities/cart';
import { useCartBooksQueries } from '@/entities/book';
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
import { CartSheetLine } from './cart-sheet-line';

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

  const cartQuery = useCartQuery({ enabled: canFetch });

  const items = cartQuery.data?.items ?? [];
  const bookQueries = useCartBooksQueries(
    items.map((item) => item.bookId),
    { enabled: canFetch && open },
  );

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

      <SheetContent side={side} className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4 text-start sm:text-start">
          <SheetTitle>{t('cart.title')}</SheetTitle>
          <SheetDescription className={count > 0 ? 'text-muted-foreground' : 'sr-only'}>
            {count > 0 ? t('nav.cartWithCount', { count }) : t('cart.title')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
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
            <ul className="flex flex-col gap-3">
              {[0, 1].map((key) => (
                <li key={key} className="rounded-lg border bg-card/50 p-3">
                  <div className="flex gap-3">
                    <Skeleton className="h-24 w-[4.5rem] shrink-0 rounded-md" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="mt-1 h-8 w-28" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
            <ul className="flex flex-col gap-3">
              {rows.map(({ item, book, line, loading }) => (
                <CartSheetLine
                  key={item.bookId}
                  bookId={item.bookId}
                  quantity={item.quantity}
                  book={book}
                  lineTotal={line}
                  loading={loading}
                  locale={locale}
                />
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 mt-auto gap-3 border-t bg-background px-4 py-4 sm:flex-col sm:space-x-0">
          {enabled && items.length > 0 ? (
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('cart.subtotal')}</span>
              <span className="text-base font-bold tabular-nums">
                {formatMoney(subtotal, 'USD', locale)}
              </span>
            </div>
          ) : null}
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
