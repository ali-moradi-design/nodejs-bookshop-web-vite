import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBookQuery, BookCoverImage, BookDetailSkeleton } from '@/entities/book';
import { useReviewsQuery } from '@/entities/review';
import { useAuthStore } from '@/features/auth';
import { AddToCartButton } from '@/features/cart';
import { FavoriteToggleButton } from '@/features/favorites';
import { CreateReviewForm, LoveRating, ReviewList } from '@/features/reviews';
import { useTrackRecentlyViewed } from '@/features/recently-viewed';
import { formatMoney } from '@/shared/lib';
import { usePreferences, usePageTitle } from '@/shared/hooks';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { ApiError } from '@/shared/api';

type Props = { bookId: string };

export function BookDetailPanel({ bookId }: Props) {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);

  const bookQuery = useBookQuery(bookId);
  useTrackRecentlyViewed(bookQuery.data);
  usePageTitle(bookQuery.data?.title ?? t('nav.catalog'));

  const reviewsQuery = useReviewsQuery({ book: bookId, limit: 50 }, { enabled: Boolean(bookId) });
  const reviews = reviewsQuery.data ?? [];

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / reviews.length);
  }, [reviews]);

  const myReview = useMemo(
    () => (user ? reviews.find((r) => r.user === user.id) : undefined),
    [reviews, user],
  );

  if (bookQuery.isLoading) return <BookDetailSkeleton />;
  if (bookQuery.error || !bookQuery.data) {
    return (
      <Alert variant="destructive">
        {bookQuery.error instanceof ApiError ? bookQuery.error.message : t('common.error')}
      </Alert>
    );
  }

  const book = bookQuery.data;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
        <BookCoverImage
          coverImageUrl={book.coverImageUrl}
          alt={book.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            {book.featured ? <Badge>{t('book.featured')}</Badge> : null}
          </div>
          <p className="text-muted-foreground">
            {t('book.author')}: {book.author}
          </p>
          {averageRating != null ? (
            <div className="flex flex-wrap items-center gap-2">
              <LoveRating
                value={averageRating}
                readOnly
                size="md"
                aria-label={t('book.averageRating')}
              />
              <span className="text-sm text-muted-foreground">
                {t('book.averageRatingValue', {
                  rating: averageRating,
                  count: reviews.length,
                })}
              </span>
            </div>
          ) : null}
          <p className="text-2xl font-semibold">{formatMoney(book.price, book.currency, locale)}</p>
          <p className="text-sm text-muted-foreground">
            {book.stock > 0 ? `${t('book.stock')}: ${book.stock}` : t('book.outOfStock')}
          </p>
          {book.categories?.length ? (
            <div className="flex flex-wrap gap-1">
              {book.categories.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <p className="leading-relaxed text-muted-foreground">{book.description}</p>
        <div className="flex flex-wrap gap-2">
          <AddToCartButton bookId={bookId} disabled={book.stock <= 0 || !user} />
          <FavoriteToggleButton bookId={bookId} isAuthenticated={Boolean(user)} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('book.reviews')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <CreateReviewForm
                key={myReview?.id ?? 'new'}
                bookId={bookId}
                existingReview={myReview}
              />
            ) : null}
            <ReviewList reviews={reviews} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
