import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  deleteUser,
  fetchUsers,
  getRoleNames,
  updateUser,
  userKeys,
  type User,
} from '@/entities/user';
import { DataTable } from '@/widgets/data-table';
import { ApiError } from '@/shared/api';
import { Alert, Badge, Button, PageLoader } from '@/shared/ui';

export function AdminUsersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => (await fetchUsers()).data,
  });

  const toggleActive = useMutation({
    mutationFn: (user: User) => updateUser(user.id, { isActive: !user.isActive }),
    onSuccess: () => {
      toast.success('User updated');
      void qc.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted');
      void qc.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        id: 'roles',
        header: 'Roles',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {getRoleNames(row.original).map((r) => (
              <Badge key={r} variant="secondary">
                {r}
              </Badge>
            ))}
          </div>
        ),
      },
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
            <Button size="sm" variant="outline" onClick={() => toggleActive.mutate(row.original)}>
              Toggle
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm('Delete user?')) remove.mutate(row.original.id);
              }}
            >
              {t('common.delete')}
            </Button>
          </div>
        ),
      },
    ],
    [t, toggleActive, remove],
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
      <h1 className="text-2xl font-bold">{t('admin.manageUsers')}</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
