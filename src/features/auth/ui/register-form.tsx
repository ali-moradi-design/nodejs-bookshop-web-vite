import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/shared/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { useAuthStore } from '../model/auth-store';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created');
      navigate('/panel');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t('common.error'));
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('auth.registerTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label>{t('auth.name')}</Label>
            <Input {...form.register('name')} />
          </div>
          <div className="space-y-1">
            <Label>{t('auth.email')}</Label>
            <Input type="email" {...form.register('email')} />
          </div>
          <div className="space-y-1">
            <Label>{t('auth.password')}</Label>
            <Input type="password" {...form.register('password')} />
          </div>
          <Button
            className="w-full text-white"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('nav.register')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary underline">
            {t('nav.login')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
