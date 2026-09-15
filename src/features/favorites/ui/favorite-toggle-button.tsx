import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { addFavorite, favoriteKeys, fetchFavorites, removeFavorite } from '@/entities/favorite';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui';

type Props = { bookId: string };

export function FavoriteToggleButton({ bookId }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const favQuery = useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
  });

  const isFav = favQuery.data?.some((f) => f.bookId === bookId);

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (isFav) await removeFavorite(bookId);
      else await addFavorite(bookId);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: favoriteKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <Button variant="outline" onClick={() => toggleFav.mutate()} disabled={toggleFav.isPending}>
      <Heart className={isFav ? 'fill-current' : undefined} />
      {isFav ? t('book.unfavorite') : t('book.favorite')}
    </Button>
  );
}
