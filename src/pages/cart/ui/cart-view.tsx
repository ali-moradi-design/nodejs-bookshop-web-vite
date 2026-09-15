import { Link } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { cartKeys, fetchCart } from '@/entities/cart';
import { bookKeys, fetchBook } from '@/entities/book';
import { useAuthStore } from '@/features/auth';
import { CartLineControls, ClearCartButton } from '@/features/cart';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import {
  Alert,
  Button,
  EmptyState,
  PageLoader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

export function CartPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);

  const cartQuery = useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => (await fetchCart()).data,
    enabled: Boolean(user),
  });

  const items = cartQuery.data?.items ?? [];
  const bookQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: bookKeys.detail(item.bookId),
      queryFn: async () => (await fetchBook(item.bookId)).data,
      enabled: Boolean(user),
    })),
  });

  if (!user) {
    return (
      <EmptyState
        title={t('cart.title')}
        description="Please log in to view your cart."
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
        {cartQuery.error instanceof ApiError ? cartQuery.error.message : t('common.error')}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('cart.empty')}
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
    const line = (book?.price ?? 0) * item.quantity;
    return { item, book, line };
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
            {rows.map(({ item, book, line }) => (
              <TableRow key={item.bookId}>
                <TableCell>
                  <div className="font-medium">{book?.title ?? item.bookId}</div>
                  <div className="text-xs text-muted-foreground">{book?.author}</div>
                </TableCell>
                <TableCell>
                  <CartLineControls bookId={item.bookId} quantity={item.quantity} />
                </TableCell>
                <TableCell>{formatMoney(line, book?.currency || 'USD', locale)}</TableCell>
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
