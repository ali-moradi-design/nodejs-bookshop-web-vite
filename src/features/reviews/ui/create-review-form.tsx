import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Review } from '@/entities/review';
import { zInt } from '@/shared/lib';
import { Button, Label, Textarea } from '@/shared/ui';
import { useCreateReviewMutation } from '../model/use-create-review-mutation';
import { useUpdateReviewMutation } from '../model/use-update-review-mutation';
import { LoveRating } from './love-rating';

const reviewSchema = z.object({
  rating: zInt.pipe(z.number().int().min(1).max(5)),
  comment: z.string().max(2000).optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

type Props = {
  bookId: string;
  /** When set, submit updates this review instead of creating a new one */
  existingReview?: Review;
};

export function CreateReviewForm({ bookId, existingReview }: Props) {
  const { t } = useTranslation();
  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewForm>,
    defaultValues: {
      rating: existingReview?.rating ?? 5,
      comment: existingReview?.comment ?? '',
    },
  });

  const rating = form.watch('rating');

  const createReview = useCreateReviewMutation(bookId, {
    onSuccess: () => form.reset({ rating: 5, comment: '' }),
  });
  const updateReviewMut = useUpdateReviewMutation();

  const pending = createReview.isPending || updateReviewMut.isPending;

  return (
    <form
      className="space-y-3 rounded-lg border p-4"
      onSubmit={form.handleSubmit((v) => {
        if (existingReview) {
          updateReviewMut.mutate({ id: existingReview.id, ...v });
        } else {
          createReview.mutate(v);
        }
      })}
    >
      <div className="space-y-2">
        <Label>{t('book.yourRating')}</Label>
        <LoveRating
          value={rating}
          onChange={(next) =>
            form.setValue('rating', next, { shouldValidate: true, shouldDirty: true })
          }
          size="md"
        />
        {form.formState.errors.rating ? (
          <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <Label>{t('book.writeReview')}</Label>
        <Textarea {...form.register('comment')} />
      </div>
      <Button type="submit" disabled={pending}>
        {t('common.save')}
      </Button>
    </form>
  );
}
