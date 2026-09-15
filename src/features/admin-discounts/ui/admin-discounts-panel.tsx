import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zNum, zNumOptional } from '@/shared/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  createDiscount,
  deleteDiscount,
  DISCOUNT_TYPES,
  discountKeys,
  fetchDiscounts,
  updateDiscount,
  type Discount,
} from '@/entities/discount';
import { DataTable } from '@/shared/ui';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

const schema = z.object({
  code: z.string().min(1),
  type: z.enum(DISCOUNT_TYPES),
  value: zNum.pipe(z.number().positive()),
  minOrderAmount: zNumOptional,
  maxUses: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().int().positive().optional(),
  ),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AdminDiscountsPanel() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: discountKeys.list(),
    queryFn: async () => (await fetchDiscounts()).data,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { code: '', type: 'percent', value: 10, isActive: true },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ code: '', type: 'percent', value: 10, isActive: true });
    setOpen(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    form.reset({
      code: d.code,
      type: d.type,
      value: d.value,
      minOrderAmount: d.minOrderAmount,
      maxUses: d.maxUses,
      isActive: d.isActive,
    });
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      editing ? updateDiscount(editing.id, values) : createDiscount(values),
    onSuccess: () => {
      toast.success('Saved');
      setOpen(false);
      void qc.invalidateQueries({ queryKey: discountKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: () => {
      toast.success('Deleted');
      void qc.invalidateQueries({ queryKey: discountKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const columns = useMemo<ColumnDef<Discount>[]>(
    () => [
      { accessorKey: 'code', header: 'Code' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'value', header: 'Value' },
      { accessorKey: 'usedCount', header: 'Used' },
      {
        accessorKey: 'isActive',
        header: 'Active',
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'success' : 'outline'}>
            {row.original.isActive ? 'yes' : 'no'}
          </Badge>
        ),
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
                if (confirm('Delete discount?')) remove.mutate(row.original.id);
              }}
            >
              {t('common.delete')}
            </Button>
          </div>
        ),
      },
    ],
    [t, remove],
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
        <h1 className="text-2xl font-bold">{t('nav.discounts')}</h1>
        <Button onClick={openCreate}>{t('common.create')}</Button>
      </div>
      <DataTable columns={columns} data={data ?? []} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('common.edit') : t('common.create')} discount</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
            <div className="space-y-1">
              <Label>code</Label>
              <Input {...form.register('code')} />
            </div>
            <div className="space-y-1">
              <Label>type</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(v) => form.setValue('type', v as FormValues['type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>value</Label>
              <Input type="number" step="0.01" {...form.register('value')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>minOrderAmount</Label>
                <Input type="number" {...form.register('minOrderAmount')} />
              </div>
              <div className="space-y-1">
                <Label>maxUses</Label>
                <Input type="number" {...form.register('maxUses')} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register('isActive')} /> Active
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
