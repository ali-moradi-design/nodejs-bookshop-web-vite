import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { favoriteKeys, removeFavorite } from '@/entities/favorite';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/ui';

type Props = { bookId: string };

export function RemoveFavoriteButton({ bookId }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: () => removeFavorite(bookId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: favoriteKeys.all }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <Button variant="outline" size="sm" onClick={() => remove.mutate()}>
      {t('common.delete')}
    </Button>
  );
}
