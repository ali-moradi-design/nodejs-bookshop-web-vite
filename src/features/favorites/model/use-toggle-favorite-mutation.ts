import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { addFavorite, favoriteKeys, removeFavorite, type Favorite } from '@/entities/favorite';
import { ApiError } from '@/shared/api';

export function useToggleFavoriteMutation(bookId: string, isFav: boolean) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
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
}
