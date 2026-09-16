import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/shared/ui';
import { useCheckoutMutation, type CheckoutFormValues } from '../model/use-checkout-mutation';

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

type Props = { defaultFullName?: string };

export function CheckoutForm({ defaultFullName = '' }: Props) {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      fullName: defaultFullName,
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      discountCode: '',
    },
  });

  const checkout = useCheckoutMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('checkout.shipping')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit((v) => checkout.mutate(v as CheckoutFormValues))}
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
  );
}
