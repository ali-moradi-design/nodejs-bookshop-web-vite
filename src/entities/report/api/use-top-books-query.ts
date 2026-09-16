import { useQuery } from '@tanstack/react-query';
import { reportKeys, fetchTopBooks } from './report-api';

export function useTopBooksQuery(from?: string, to?: string) {
  return useQuery({
    queryKey: reportKeys.topBooks(from, to),
    queryFn: async () => (await fetchTopBooks(from, to)).data,
  });
}
