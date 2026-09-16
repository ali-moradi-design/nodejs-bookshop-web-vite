import { useQuery } from '@tanstack/react-query';
import { orderKeys, fetchOrder } from './order-api';

type Options = {
  enabled?: boolean;
};

export function useOrderQuery(id: string, options: Options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => (await fetchOrder(id)).data,
    enabled: enabled && Boolean(id),
  });
}
