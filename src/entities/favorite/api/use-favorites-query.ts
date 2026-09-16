import { useQuery } from '@tanstack/react-query';
import { favoriteKeys, fetchFavorites } from './favorite-api';

type Options = {
  enabled?: boolean;
};

export function useFavoritesQuery(options: Options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => (await fetchFavorites()).data,
    enabled,
  });
}
