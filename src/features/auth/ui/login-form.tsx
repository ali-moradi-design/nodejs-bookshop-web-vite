import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { isAdminUser } from '@/entities/user';
import { ApiError } from '@/shared/api';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { useAuthStore } from '../model/auth-store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const user = await login(values.email, values.password);
      toast.success('Logged in');
      navigate(isAdminUser(user) ? '/admin' : '/panel');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t('common.error'));
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('auth.loginTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label>{t('auth.email')}</Label>
            <Input type="email" autoComplete="email" {...form.register('email')} />
          </div>
          <div className="space-y-1">
            <Label>{t('auth.password')}</Label>
            <Input type="password" autoComplete="current-password" {...form.register('password')} />
          </div>
          <Button
            className="w-full text-white"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('nav.login')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary underline">
            {t('nav.register')}
          </Link>
        </p>
        <Alert className="mt-4 text-xs">{t('auth.adminHint')}</Alert>
      </CardContent>
    </Card>
  );
}
