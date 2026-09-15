import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  addFavorite,
  favoriteKeys,
  fetchFavorites,
  removeFavorite,
  type Favorite,
} from '@/entities/favorite';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib';

type Props = {
  bookId: string;
  /** Icon-only control for BookCard overlay */
  compact?: boolean;
  /** When false, compact mode links to login instead of toggling */
  isAuthenticated?: boolean;
  className?: string;
};

export function FavoriteToggleButton({
  bookId,
  compact = false,
  isAuthenticated = true,
  className,
}: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const favQuery = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
    enabled: isAuthenticated,
  });

  const isFav = favQuery.data?.some((f) => f.bookId === bookId) ?? false;

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (isFav) await removeFavorite(bookId);
      else await addFavorite(bookId);
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: favoriteKeys.all });
      const previous = qc.getQueryData<Favorite[]>(favoriteKeys.list());
      qc.setQueryData<Favorite[]>(favoriteKeys.list(), (old = []) => {
        if (isFav) return old.filter((f) => f.bookId !== bookId);
        const optimistic: Favorite = {
          id: `optimistic-${bookId}`,
          userId: '',
          bookId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...old, optimistic];
      });
      return { previous };
    },
    onSuccess: () => {
      toast.success(isFav ? t('toast.removedFavorite') : t('toast.addedFavorite'));
    },
    onError: (e, _v, ctx) => {
      if (ctx?.previous !== undefined) qc.setQueryData(favoriteKeys.list(), ctx.previous);
      toast.error(e instanceof ApiError ? e.message : t('common.error'));
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });

  if (!isAuthenticated) {
    if (!compact) return null;
    return (
      <Button
        variant="secondary"
        size="icon"
        className={cn('h-8 w-8 rounded-full bg-background/90 shadow-sm', className)}
        asChild
        onClick={(e) => e.stopPropagation()}
      >
        <Link to="/login" aria-label={t('nav.login')}>
          <Heart className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  if (compact) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn('h-8 w-8 rounded-full bg-background/90 shadow-sm', className)}
        aria-label={isFav ? t('book.unfavorite') : t('book.favorite')}
        aria-pressed={isFav}
        disabled={toggleFav.isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFav.mutate();
        }}
      >
        <Heart className={cn('h-4 w-4', isFav && 'fill-current text-destructive')} />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => toggleFav.mutate()}
      disabled={toggleFav.isPending}
      aria-pressed={isFav}
    >
      <Heart className={isFav ? 'fill-current' : undefined} />
      {isFav ? t('book.unfavorite') : t('book.favorite')}
    </Button>
  );
}
