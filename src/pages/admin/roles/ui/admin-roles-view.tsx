import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { fetchRoles, roleKeys, type Role } from '@/entities/role';
import { DataTable } from '@/shared/ui';
import { Alert, Badge, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function AdminRolesPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: roleKeys.list(),
    queryFn: async () => (await fetchRoles()).data,
  });

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'description', header: 'Description' },
      {
        id: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
          const perms = row.original.permissions || [];
          const labels = perms.map((p) => (typeof p === 'string' ? p : p.slug)).slice(0, 8);
          return (
            <div className="flex max-w-md flex-wrap gap-1">
              {labels.map((p) => (
                <Badge key={p} variant="outline">
                  {p}
                </Badge>
              ))}
              {perms.length > 8 ? <Badge variant="secondary">+{perms.length - 8}</Badge> : null}
            </div>
          );
        },
      },
    ],
    [],
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
      <h1 className="text-2xl font-bold">{t('nav.roles')}</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
