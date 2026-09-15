import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zInt, zNum } from '@/shared/lib/zod-helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  bookKeys,
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
  uploadBookCover,
  type Book,
} from '@/entities/book';
import { DataTable } from '@/widgets/data-table';
import { formatMoney } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  PageLoader,
  Textarea,
} from '@/shared/ui';

const schema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  isbn: z.string().optional(),
  price: zNum.pipe(z.number().nonnegative()),
  stock: zInt.pipe(z.number().int().nonnegative()),
  categories: z.string().optional(),
  featured: z.boolean().optional(),
  coverImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AdminBooksPage() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: bookKeys.list({ page, limit: 20 }),
    queryFn: () => fetchBooks({ page, limit: 20, sort: 'createdAt', order: 'desc' }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      title: '',
      author: '',
      description: '',
      isbn: '',
      price: 0,
      stock: 0,
      categories: '',
      featured: false,
      coverImageUrl: '',
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      title: '',
      author: '',
      description: '',
      isbn: '',
      price: 0,
      stock: 0,
      categories: '',
      featured: false,
      coverImageUrl: '',
    });
    setOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    form.reset({
      title: book.title,
      author: book.author,
      description: book.description,
      isbn: book.isbn || '',
      price: book.price,
      stock: book.stock,
      categories: (book.categories || []).join(', '),
      featured: book.featured,
      coverImageUrl: book.coverImageUrl || '',
    });
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
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
      if (editing) return updateBook(editing.id, payload);
      return createBook(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Book updated' : 'Book created');
      setOpen(false);
      void qc.invalidateQueries({ queryKey: bookKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      toast.success('Book deleted');
      void qc.invalidateQueries({ queryKey: bookKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const onUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const res = await uploadBookCover(file);
      form.setValue('coverImageUrl', res.url);
      toast.success('Cover uploaded');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t('common.error'));
    }
  };

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'author', header: 'Author' },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatMoney(row.original.price, row.original.currency, locale),
      },
      { accessorKey: 'stock', header: 'Stock' },
      {
        accessorKey: 'featured',
        header: 'Featured',
        cell: ({ row }) =>
          row.original.featured ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>,
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
              {t('common.edit')}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm('Delete this book?')) remove.mutate(row.original.id);
              }}
            >
              {t('common.delete')}
            </Button>
          </div>
        ),
      },
    ],
    [t, locale, remove],
  );

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Alert variant="destructive">
        {error instanceof ApiError ? error.message : t('common.error')}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin.manageBooks')}</h1>
        <Button onClick={openCreate}>{t('common.create')}</Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        manualPagination
        pageCount={data?.meta.pages ?? 1}
        pagination={{ pageIndex: page - 1, pageSize: 20 }}
        onPaginationChange={(p) => setPage(p.pageIndex + 1)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t('common.edit') : t('common.create')} book</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
            {(['title', 'author', 'isbn'] as const).map((name) => (
              <div key={name} className="space-y-1">
                <Label>{name}</Label>
                <Input {...form.register(name)} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>description</Label>
              <Textarea {...form.register('description')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>price</Label>
                <Input type="number" step="0.01" {...form.register('price')} />
              </div>
              <div className="space-y-1">
                <Label>stock</Label>
                <Input type="number" {...form.register('stock')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>categories (comma-separated)</Label>
              <Input {...form.register('categories')} />
            </div>
            <div className="space-y-1">
              <Label>coverImageUrl</Label>
              <Input {...form.register('coverImageUrl')} />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => void onUpload(e.target.files?.[0])}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register('featured')} /> Featured
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
