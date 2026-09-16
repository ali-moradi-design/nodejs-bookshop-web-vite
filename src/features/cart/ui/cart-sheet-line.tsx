import { Link } from 'react-router-dom';
import type { Book } from '@/entities/book';
import { BookCoverImage } from '@/entities/book';
import { formatMoney } from '@/shared/lib';
import { SheetClose, Skeleton } from '@/shared/ui';
import { CartLineControls } from './cart-line-controls';

type Props = {
  bookId: string;
  quantity: number;
  book?: Book;
  lineTotal: number;
  loading?: boolean;
  locale: string;
};

export function CartSheetLine({ bookId, quantity, book, lineTotal, loading, locale }: Props) {
  const currency = book?.currency || 'USD';
  const title = loading ? '…' : (book?.title ?? bookId);

  return (
    <li className="rounded-lg border bg-card/50 p-3">
      <div className="flex gap-3">
        <SheetClose asChild>
          <Link
            to={`/books/${bookId}`}
            className="relative block h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm"
          >
            {loading ? (
              <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
            ) : (
              <BookCoverImage
                coverImageUrl={book?.coverImageUrl}
                alt={book?.title ?? bookId}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {quantity > 0 ? (
              <span
                aria-hidden
                className="absolute end-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow"
              >
                {quantity > 99 ? '99+' : quantity}
              </span>
            ) : null}
          </Link>
        </SheetClose>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <SheetClose asChild>
                <Link
                  to={`/books/${bookId}`}
                  className="block truncate text-sm font-medium leading-snug hover:underline"
                >
                  {title}
                </Link>
              </SheetClose>
              {book?.author ? (
                <p className="truncate text-xs text-muted-foreground">{book.author}</p>
              ) : loading ? (
                <Skeleton className="h-3 w-20" />
              ) : null}
              {loading ? (
                <Skeleton className="h-3 w-14" />
              ) : book ? (
                <p className="text-xs text-muted-foreground">
                  {formatMoney(book.price, currency, locale)}
                </p>
              ) : null}
            </div>
            <p className="shrink-0 text-sm font-bold tabular-nums">
              {loading ? '…' : formatMoney(lineTotal, currency, locale)}
            </p>
          </div>

          <CartLineControls bookId={bookId} quantity={quantity} />
        </div>
      </div>
    </li>
  );
}
