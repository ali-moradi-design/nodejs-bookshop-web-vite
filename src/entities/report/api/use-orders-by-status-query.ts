import { useQuery } from '@tanstack/react-query';
import { reportKeys, fetchOrdersByStatus } from './report-api';

export function useOrdersByStatusQuery() {
  return useQuery({
    queryKey: reportKeys.ordersByStatus(),
    queryFn: async () => (await fetchOrdersByStatus()).data,
  });
}
