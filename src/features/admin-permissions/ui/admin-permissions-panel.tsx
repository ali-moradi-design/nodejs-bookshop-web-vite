import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { usePermissionsQuery, type Permission } from '@/entities/permission';
import { DataTable, Alert, Badge, PageLoader } from '@/shared/ui';
import { ApiError } from '@/shared/api';
import { usePageTitle } from '@/shared/hooks';

export function AdminPermissionsPanel() {
  const { t } = useTranslation();
  usePageTitle(t('nav.permissions'));
  const { data, isLoading, error } = usePermissionsQuery();

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      { accessorKey: 'slug', header: 'Slug' },
      { accessorKey: 'name', header: 'Name' },
      {
        accessorKey: 'section',
        header: 'Section',
        cell: ({ row }) => <Badge variant="secondary">{row.original.section}</Badge>,
      },
      { accessorKey: 'description', header: 'Description' },
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
      <h1 className="text-2xl font-bold">{t('nav.permissions')}</h1>
      <DataTable columns={columns} data={data ?? []} pageSize={15} />
    </div>
  );
}
