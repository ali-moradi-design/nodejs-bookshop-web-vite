import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ISSUE_TYPES } from '@/entities/report';
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
import { useCreateIssueMutation } from '../model/use-create-issue-mutation';

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

  const submit = useCreateIssueMutation({
    onSuccess: () => form.reset({ type: 'other', targetId: '', subject: '', body: '' }),
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{t('panel.submitIssue')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) =>
            submit.mutate({
              type: v.type,
              targetId: v.targetId || undefined,
              subject: v.subject,
              body: v.body,
            }),
          )}
        >
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
