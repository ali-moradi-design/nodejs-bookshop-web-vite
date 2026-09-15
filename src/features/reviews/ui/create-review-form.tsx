import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createReview, reviewKeys } from '@/entities/review';
import { zInt } from '@/shared/lib';
import { ApiError } from '@/shared/api';
import { Button, Input, Label, Textarea } from '@/shared/ui';

const reviewSchema = z.object({
  rating: zInt.pipe(z.number().int().min(1).max(5)),
  comment: z.string().max(2000).optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

type Props = { bookId: string };

export function CreateReviewForm({ bookId }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewForm>,
    defaultValues: { rating: 5, comment: '' },
  });

  const submitReview = useMutation({
    mutationFn: (values: ReviewForm) => createReview({ book: bookId, ...values }),
    onSuccess: () => {
      toast.success('Review submitted');
      form.reset({ rating: 5, comment: '' });
      void qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <form
      className="space-y-3 rounded-lg border p-4"
      onSubmit={form.handleSubmit((v) => submitReview.mutate(v))}
    >
      <div className="space-y-1">
        <Label>Rating (1–5)</Label>
        <Input type="number" min={1} max={5} {...form.register('rating')} />
      </div>
      <div className="space-y-1">
        <Label>{t('book.writeReview')}</Label>
        <Textarea {...form.register('comment')} />
      </div>
      <Button type="submit" disabled={submitReview.isPending}>
        {t('common.save')}
      </Button>
    </form>
  );
}
