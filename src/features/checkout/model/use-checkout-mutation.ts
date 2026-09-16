import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { checkoutCart, type CheckoutInput } from '@/entities/cart';
import { ApiError } from '@/shared/api';

export type CheckoutFormValues = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  discountCode?: string;
};

export function useCheckoutMutation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: CheckoutFormValues) => {
      const input: CheckoutInput = {
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
      };
      return checkoutCart(input);
    },
    onSuccess: (res) => {
      toast.success(t('toast.orderPlaced'));
      navigate(`/panel/orders/${res.data.id}`);
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t('common.error')),
  });
}
