import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createIssue, ISSUE_TYPES } from '@/entities/report';
import { ApiError } from '@/shared/api';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/ui';

const schema = z.object({
  type: z.enum(ISSUE_TYPES),
  targetId: z.string().optional(),
  subject: z.string().min(3).max(200),
  body: z.string().min(5).max(5000),
});

type FormValues = z.infer<typeof schema>;

export function ReportIssueForm() {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { type: 'other', targetId: '', subject: '', body: '' },
  });

  const submit = useMutation({
    mutationFn: (values: FormValues) =>
      createIssue({
        type: values.type,
        targetId: values.targetId || undefined,
        subject: values.subject,
        body: values.body,
      }),
    onSuccess: () => {
      toast.success('Issue submitted');
      form.reset({ type: 'other', targetId: '', subject: '', body: '' });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{t('panel.submitIssue')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((v) => submit.mutate(v))}>
          <div className="space-y-1">
            <Label>{t('panel.type')}</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(v) => form.setValue('type', v as FormValues['type'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Target ID (optional)</Label>
            <Input {...form.register('targetId')} />
          </div>
          <div className="space-y-1">
            <Label>{t('panel.subject')}</Label>
            <Input {...form.register('subject')} />
          </div>
          <div className="space-y-1">
            <Label>{t('panel.body')}</Label>
            <Textarea {...form.register('body')} />
          </div>
          <Button type="submit" disabled={submit.isPending}>
            {t('panel.submitIssue')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
