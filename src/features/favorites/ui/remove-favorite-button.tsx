import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useRemoveFavoriteMutation } from '../model/use-remove-favorite-mutation';

type Props = { bookId: string };

export function RemoveFavoriteButton({ bookId }: Props) {
  const { t } = useTranslation();
  const remove = useRemoveFavoriteMutation(bookId);

  return (
    <Button variant="outline" size="sm" onClick={() => remove.mutate()}>
      {t('common.delete')}
    </Button>
  );
}
