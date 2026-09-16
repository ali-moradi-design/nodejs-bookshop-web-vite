import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateReview, reviewKeys } from '@/entities/review';
import type { UpdateReviewInput } from '@/entities/review';
import { ApiError } from '@/shared/api';

type Options = {
  onSuccess?: () => void;
};

export function useUpdateReviewMutation(options: Options = {}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { onSuccess } = options;

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateReviewInput & { id: string }) => updateReview(id, input),
    onSuccess: () => {
      toast.success(t('book.reviewUpdated'));
      onSuccess?.();
      void qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
