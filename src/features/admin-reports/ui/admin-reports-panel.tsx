import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  fetchIssues,
  ISSUE_STATUSES,
  reportKeys,
  updateIssue,
  type IssueReport,
  type IssueStatus,
} from '@/entities/report';
import { DataTable } from '@/shared/ui';
import { formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import {
  Alert,
  PageLoader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

export function AdminReportsPanel() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: reportKeys.issues(),
    queryFn: async () => (await fetchIssues()).data,
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IssueStatus }) =>
      updateIssue(id, { status }),
    onSuccess: () => {
      toast.success('Issue updated');
      void qc.invalidateQueries({ queryKey: reportKeys.issues() });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  const columns = useMemo<ColumnDef<IssueReport>[]>(
    () => [
      { accessorKey: 'subject', header: 'Subject' },
      { accessorKey: 'type', header: 'Type' },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(v) => update.mutate({ id: row.original.id, status: v as IssueStatus })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ISSUE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        id: 'reporter',
        header: 'Reporter',
        cell: ({ row }) => row.original.populated?.reporter?.email || row.original.reporter,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatDate(row.original.createdAt, locale),
      },
    ],
    [t, locale, update],
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
      <h1 className="text-2xl font-bold">{t('nav.reports')}</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
