import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getRoleNames, type User } from '@/entities/user';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { useUpdateProfileMutation } from '../model/use-update-profile-mutation';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  user: User;
  onUpdated: (user: User) => void | Promise<void>;
};

export function ProfileForm({ user, onUpdated }: Props) {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    values: {
      name: user.name || '',
      email: user.email || '',
      password: '',
    },
  });

  const save = useUpdateProfileMutation(user.id, { onUpdated });

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Roles: {getRoleNames(user).join(', ') || '—'}
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
          <div className="space-y-1">
            <Label>{t('auth.name')}</Label>
            <Input {...form.register('name')} />
          </div>
          <div className="space-y-1">
            <Label>{t('auth.email')}</Label>
            <Input type="email" {...form.register('email')} />
          </div>
          <div className="space-y-1">
            <Label>{t('auth.password')} (optional)</Label>
            <Input type="password" {...form.register('password')} />
          </div>
          <Button type="submit" disabled={save.isPending}>
            {t('common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
