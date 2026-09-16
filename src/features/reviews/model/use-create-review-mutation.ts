import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createReview, reviewKeys } from '@/entities/review';
import { ApiError } from '@/shared/api';

type Options = {
  onSuccess?: () => void;
};

export function useCreateReviewMutation(bookId: string, options: Options = {}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { onSuccess } = options;

  return useMutation({
    mutationFn: (values: { rating: number; comment?: string }) =>
      createReview({ book: bookId, ...values }),
    onSuccess: () => {
      toast.success('Review submitted');
      onSuccess?.();
      void qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
