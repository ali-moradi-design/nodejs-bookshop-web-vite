import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchBook } from '@/entities/book';
import { fetchReviews, reviewKeys, type Review } from '@/entities/review';
import { useAuthStore } from '@/features/auth';
import { AddToCartButton } from '@/features/cart';
import { FavoriteToggleButton } from '@/features/favorites';
import { CreateReviewForm, ReviewList } from '@/features/reviews';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function BookDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);

  const bookQuery = useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => (await fetchBook(id)).data,
    enabled: Boolean(id),
  });

  const reviewsQuery = useQuery({
    queryKey: reviewKeys.list({ book: id }),
    queryFn: async () => {
      const res = await fetchReviews({ book: id, limit: 50 });
      return Array.isArray((res as { data: unknown }).data) ? (res as { data: Review[] }).data : [];
    },
    enabled: Boolean(id),
  });

  if (bookQuery.isLoading) return <PageLoader />;
  if (bookQuery.error || !bookQuery.data) {
    return (
      <Alert variant="destructive">
        {bookQuery.error instanceof ApiError ? bookQuery.error.message : t('common.error')}
      </Alert>
    );
  }

  const book = bookQuery.data;
  const src = resolveImageUrl(book.coverImageUrl) || '/placeholder-book.svg';

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
        <img src={src} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
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
          <AddToCartButton bookId={id} disabled={book.stock <= 0 || !user} />
          {user ? <FavoriteToggleButton bookId={id} /> : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('book.reviews')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? <CreateReviewForm bookId={id} /> : null}
            <ReviewList reviews={reviewsQuery.data ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
