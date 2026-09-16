import { useQuery } from '@tanstack/react-query';
import { bookKeys, fetchBook } from './book-api';

type Options = {
  enabled?: boolean;
};

export function useBookQuery(id: string, options: Options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => (await fetchBook(id)).data,
    enabled: enabled && Boolean(id),
  });
}
