import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zInt } from '@/shared/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart } from 'lucide-react';
import { bookKeys, fetchBook } from '@/entities/book';
import { addCartItem, cartKeys } from '@/entities/cart';
import { addFavorite, favoriteKeys, fetchFavorites, removeFavorite } from '@/entities/favorite';
import { createReview, fetchReviews, reviewKeys } from '@/entities/review';
import { useAuthStore } from '@/features/auth';
import { formatMoney, formatDate, resolveImageUrl } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Label,
  PageLoader,
  Textarea,
} from '@/shared/ui';
import { ApiError } from '@/shared/api';

const reviewSchema = z.object({
  rating: zInt.pipe(z.number().int().min(1).max(5)),
  comment: z.string().max(2000).optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export function BookDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const bookQuery = useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => (await fetchBook(id)).data,
    enabled: Boolean(id),
  });

  const reviewsQuery = useQuery({
    queryKey: reviewKeys.list({ book: id }),
    queryFn: async () => {
      const res = await fetchReviews({ book: id, limit: 50 });
      return Array.isArray((res as { data: unknown }).data)
        ? (res as { data: import('@/entities/review').Review[] }).data
        : [];
    },
    enabled: Boolean(id),
  });

  const favQuery = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
    enabled: Boolean(user),
  });

  const isFav = favQuery.data?.some((f) => f.bookId === id);

  const addToCart = useMutation({
    mutationFn: () => addCartItem(id, 1),
    onSuccess: () => {
      toast.success('Added to cart');
      void qc.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (isFav) await removeFavorite(id);
      else await addFavorite(id);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: favoriteKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewForm>,
    defaultValues: { rating: 5, comment: '' },
  });

  const submitReview = useMutation({
    mutationFn: (values: ReviewForm) => createReview({ book: id, ...values }),
    onSuccess: () => {
      toast.success('Review submitted');
      form.reset({ rating: 5, comment: '' });
      void qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
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
          <Button
            onClick={() => addToCart.mutate()}
            disabled={book.stock <= 0 || !user || addToCart.isPending}
          >
            <ShoppingCart /> {t('book.addToCart')}
          </Button>
          {user ? (
            <Button
              variant="outline"
              onClick={() => toggleFav.mutate()}
              disabled={toggleFav.isPending}
            >
              <Heart className={isFav ? 'fill-current' : undefined} />
              {isFav ? t('book.unfavorite') : t('book.favorite')}
            </Button>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('book.reviews')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <form
                className="space-y-3 rounded-lg border p-4"
                onSubmit={form.handleSubmit((v) => submitReview.mutate(v))}
              >
                <div className="space-y-1">
                  <Label>Rating (1–5)</Label>
                  <Input type="number" min={1} max={5} {...form.register('rating')} />
                </div>
                <div className="space-y-1">
                  <Label>{t('book.writeReview')}</Label>
                  <Textarea {...form.register('comment')} />
                </div>
                <Button type="submit" disabled={submitReview.isPending}>
                  {t('common.save')}
                </Button>
              </form>
            ) : null}
            {(reviewsQuery.data ?? []).length === 0 ? (
              <EmptyState title={t('common.empty')} />
            ) : (
              <ul className="space-y-3">
                {(reviewsQuery.data ?? []).map((r) => (
                  <li key={r.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {r.populated?.user?.name || 'User'} · ★ {r.rating}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDate(r.createdAt, locale)}
                      </span>
                    </div>
                    {r.comment ? (
                      <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
