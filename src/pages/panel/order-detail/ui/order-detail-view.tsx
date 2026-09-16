import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderQuery } from '@/entities/order';
import { PayOrderButton } from '@/features/pay-order';
import { formatMoney, formatDate } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { ApiError } from '@/shared/api';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/shared/ui';

export function PanelOrderDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);

  const { data, isLoading, error } = useOrderQuery(id);

  if (isLoading) return <PageLoader />;
  if (error || !data) {
    return (
      <Alert variant="destructive">
        {error instanceof ApiError ? error.message : t('common.error')}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('panel.orderDetail')}</h1>
          <p className="text-sm text-muted-foreground">{data.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{data.status}</Badge>
          <PayOrderButton orderId={id} visible={data.status === 'pending_payment'} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatMoney(item.price * item.quantity, 'USD', locale)}</span>
              </div>
            ))}
            <div className="border-t pt-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(data.subtotalAmount, 'USD', locale)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{formatMoney(data.discountAmount, 'USD', locale)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatMoney(data.totalAmount, 'USD', locale)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('checkout.shipping')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{data.shippingAddress.fullName}</p>
            <p>{data.shippingAddress.line1}</p>
            {data.shippingAddress.line2 ? <p>{data.shippingAddress.line2}</p> : null}
            <p>
              {data.shippingAddress.city}
              {data.shippingAddress.state ? `, ${data.shippingAddress.state}` : ''}{' '}
              {data.shippingAddress.postalCode}
            </p>
            <p>{data.shippingAddress.country}</p>
            <p className="pt-2 text-muted-foreground">{formatDate(data.createdAt, locale)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
