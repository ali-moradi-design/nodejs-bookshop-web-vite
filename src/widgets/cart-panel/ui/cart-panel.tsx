import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartQuery } from '@/entities/cart';
import { BookCoverImage, useCartBooksQueries } from '@/entities/book';
import { useAuthStore } from '@/features/auth';
import { CartLineControls, ClearCartButton } from '@/features/cart';
import { formatMoney } from '@/shared/lib';
import { usePreferences, usePageTitle } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import {
  Alert,
  Button,
  EmptyState,
  PageLoader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

export function CartPanel() {
  const { t } = useTranslation();
  usePageTitle(t('cart.title'));
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);

  const cartQuery = useCartQuery({ enabled: Boolean(user) });

  const items = cartQuery.data?.items ?? [];
  const bookQueries = useCartBooksQueries(
    items.map((item) => item.bookId),
    { enabled: Boolean(user) },
  );

  if (!user) {
    return (
      <EmptyState
        title={t('cart.title')}
        description={t('cart.loginHint')}
        action={
          <Button asChild>
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
        }
      />
    );
  }

  if (cartQuery.isLoading) return <PageLoader />;
  if (cartQuery.error) {
    return (
      <Alert variant="destructive">
        {cartQuery.error instanceof ApiError ? cartQuery.error.message : t('common.error')}{' '}
        <button type="button" className="underline" onClick={() => void cartQuery.refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('cart.empty')}
        description={t('cart.emptyHint')}
        action={
          <Button asChild>
            <Link to="/catalog">{t('nav.catalog')}</Link>
          </Button>
        }
      />
    );
  }

  const rows = items.map((item, i) => {
    const book = bookQueries[i]?.data;
    const loading = bookQueries[i]?.isLoading;
    const line = (book?.price ?? 0) * item.quantity;
    return { item, book, line, loading };
  });
  const subtotal = rows.reduce((sum, row) => sum + row.line, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('cart.title')}</h1>
        <ClearCartButton />
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>{t('cart.quantity')}</TableHead>
              <TableHead>{t('book.price')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ item, book, line, loading }) => (
              <TableRow key={item.bookId}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Link
                      to={`/books/${item.bookId}`}
                      className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm"
                    >
                      {loading ? (
                        <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
                      ) : (
                        <BookCoverImage
                          coverImageUrl={book?.coverImageUrl}
                          alt={book?.title ?? item.bookId}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/books/${item.bookId}`} className="font-medium hover:underline">
                        {book?.title ?? item.bookId}
                      </Link>
                      <div className="text-xs text-muted-foreground">{book?.author}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <CartLineControls bookId={item.bookId} quantity={item.quantity} />
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatMoney(line, book?.currency || 'USD', locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <div className="text-lg font-semibold">
          {t('cart.subtotal')}: {formatMoney(subtotal, 'USD', locale)}
        </div>
        <Button asChild>
          <Link to="/checkout">{t('cart.checkout')}</Link>
        </Button>
      </div>
    </div>
  );
}
