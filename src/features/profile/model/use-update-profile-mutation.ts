import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateUser, type User } from '@/entities/user';
import { ApiError } from '@/shared/api';

export type UpdateProfileValues = {
  name: string;
  email: string;
  password?: string;
};

type Options = {
  onUpdated: (user: User) => void | Promise<void>;
};

export function useUpdateProfileMutation(userId: string, { onUpdated }: Options) {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (values: UpdateProfileValues) =>
      updateUser(userId, {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
      }),
    onSuccess: async (res) => {
      await onUpdated(res.data);
      toast.success('Profile updated');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
