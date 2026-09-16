import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavoritesQuery } from '@/entities/favorite';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib';
import { useToggleFavoriteMutation } from '../model/use-toggle-favorite-mutation';

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

  const favQuery = useFavoritesQuery({ enabled: isAuthenticated });
  const isFav = favQuery.data?.some((f) => f.bookId === bookId) ?? false;
  const toggleFav = useToggleFavoriteMutation(bookId, isFav);

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
