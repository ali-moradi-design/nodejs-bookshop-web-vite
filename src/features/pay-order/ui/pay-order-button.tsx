import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { usePayOrderMutation } from '../model/use-pay-order-mutation';

type Props = {
  orderId: string;
  /** Only render when status allows payment */
  visible?: boolean;
};

export function PayOrderButton({ orderId, visible = true }: Props) {
  const { t } = useTranslation();
  const pay = usePayOrderMutation(orderId);

  if (!visible) return null;

  return (
    <Button onClick={() => pay.mutate()} disabled={pay.isPending}>
      {t('panel.pay')}
    </Button>
  );
}
