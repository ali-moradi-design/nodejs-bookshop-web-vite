import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartQuery } from '@/entities/cart';
import { BookCoverImage, useCartBooksQueries } from '@/entities/book';
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
              <div className="flex gap-3">
                <Skeleton className="h-16 w-12 shrink-0 rounded-md" />
                <Skeleton className="h-16 flex-1" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-16 w-12 shrink-0 rounded-md" />
                <Skeleton className="h-16 flex-1" />
              </div>
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
                  <div className="flex items-start gap-3">
                    <SheetClose asChild>
                      <Link
                        to={`/books/${item.bookId}`}
                        className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-md border bg-muted"
                      >
                        {loading ? (
                          <Skeleton className="absolute inset-0 h-full w-full" />
                        ) : (
                          <BookCoverImage
                            coverImageUrl={book?.coverImageUrl}
                            alt={book?.title ?? item.bookId}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}
                      </Link>
                    </SheetClose>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <SheetClose asChild>
                            <Link
                              to={`/books/${item.bookId}`}
                              className="block truncate text-sm font-medium hover:underline"
                            >
                              {loading ? '…' : (book?.title ?? item.bookId)}
                            </Link>
                          </SheetClose>
                          {book?.author ? (
                            <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                          ) : null}
                        </div>
                        <p className="shrink-0 text-sm font-medium">
                          {formatMoney(line, book?.currency || 'USD', locale)}
                        </p>
                      </div>
                      <CartLineControls bookId={item.bookId} quantity={item.quantity} />
                    </div>
                  </div>
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
