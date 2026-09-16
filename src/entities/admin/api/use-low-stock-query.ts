import { useQuery } from '@tanstack/react-query';
import { adminKeys, fetchLowStock } from './admin-api';

export function useLowStockQuery(threshold = 5) {
  return useQuery({
    queryKey: adminKeys.lowStock(threshold),
    queryFn: async () => (await fetchLowStock(threshold)).data,
  });
}
