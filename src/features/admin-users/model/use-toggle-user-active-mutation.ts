import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateUser, userKeys, type User } from '@/entities/user';
import { ApiError } from '@/shared/api';

export function useToggleUserActiveMutation() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => updateUser(user.id, { isActive: !user.isActive }),
    onSuccess: () => {
      toast.success('User updated');
      void qc.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
