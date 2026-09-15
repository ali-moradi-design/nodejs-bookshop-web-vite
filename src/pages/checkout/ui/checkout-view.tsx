import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { checkoutCart } from '@/entities/cart';
import { useAuthStore } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '@/shared/ui';

const schema = z.object({
  fullName: z.string().min(2),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  discountCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      fullName: user?.name || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      discountCode: '',
    },
  });

  const checkout = useMutation({
    mutationFn: (values: FormValues) =>
      checkoutCart({
        shippingAddress: {
          fullName: values.fullName,
          line1: values.line1,
          line2: values.line2 || undefined,
          city: values.city,
          state: values.state || undefined,
          postalCode: values.postalCode,
          country: values.country,
        },
        discountCode: values.discountCode || undefined,
      }),
    onSuccess: (res) => {
      toast.success('Order placed');
      navigate(`/panel/orders/${res.data.id}`);
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });

  if (!user) {
    return (
      <EmptyState
        title={t('checkout.title')}
        description="Please log in to checkout."
        action={
          <Button asChild>
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('checkout.shipping')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={form.handleSubmit((v) => checkout.mutate(v))}
          >
            {(
              [
                ['fullName', t('checkout.fullName')],
                ['line1', t('checkout.line1')],
                ['line2', t('checkout.line2')],
                ['city', t('checkout.city')],
                ['state', t('checkout.state')],
                ['postalCode', t('checkout.postalCode')],
                ['country', t('checkout.country')],
                ['discountCode', t('checkout.discount')],
              ] as const
            ).map(([name, label]) => (
              <div key={name} className="space-y-1 sm:col-span-1">
                <Label>{label}</Label>
                <Input {...form.register(name)} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={checkout.isPending} className="w-full sm:w-auto">
                {t('checkout.placeOrder')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
