import { useQuery } from '@tanstack/react-query';
import { discountKeys, fetchDiscounts } from './discount-api';

export function useDiscountsQuery() {
  return useQuery({
    queryKey: discountKeys.list(),
    queryFn: async () => (await fetchDiscounts()).data,
  });
}
