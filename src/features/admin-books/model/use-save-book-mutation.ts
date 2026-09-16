import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { bookKeys, createBook, updateBook } from '@/entities/book';
import { ApiError } from '@/shared/api';

export type SaveBookValues = {
  title: string;
  author: string;
  description: string;
  isbn?: string;
  price: number;
  stock: number;
  categories?: string;
  featured?: boolean;
  coverImageUrl?: string;
};

type Options = {
  editingId?: string | null;
  onSuccess?: () => void;
};

export function useSaveBookMutation({ editingId = null, onSuccess }: Options = {}) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: SaveBookValues) => {
      const payload = {
        title: values.title,
        author: values.author,
        description: values.description,
        isbn: values.isbn || undefined,
        price: values.price,
        stock: values.stock,
        categories: values.categories
          ? values.categories
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        featured: Boolean(values.featured),
        coverImageUrl: values.coverImageUrl || undefined,
      };
      if (editingId) return updateBook(editingId, payload);
      return createBook(payload);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Book updated' : 'Book created');
      onSuccess?.();
      void qc.invalidateQueries({ queryKey: bookKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
