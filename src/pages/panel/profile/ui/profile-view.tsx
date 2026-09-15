import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { updateUser } from '@/entities/user';
import { ApiError } from '@/shared/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { getRoleNames } from '@/entities/user';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const refreshMe = useAuthStore((s) => s.refreshMe);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    values: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
  });

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      updateUser(user!.id, {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
      }),
    onSuccess: async (res) => {
      setUser(res.data);
      await refreshMe();
      toast.success('Profile updated');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.profile')}</h1>
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
    </div>
  );
}
