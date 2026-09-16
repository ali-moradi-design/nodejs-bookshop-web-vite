import { useQuery } from '@tanstack/react-query';
import { adminKeys, fetchRecentOrders } from './admin-api';

export function useRecentOrdersQuery(limit = 10) {
  return useQuery({
    queryKey: adminKeys.recentOrders(limit),
    queryFn: async () => (await fetchRecentOrders(limit)).data,
  });
}
