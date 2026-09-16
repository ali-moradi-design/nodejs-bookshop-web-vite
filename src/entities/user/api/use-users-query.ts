import { useQuery } from '@tanstack/react-query';
import { userKeys, fetchUsers } from './user-api';

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => (await fetchUsers()).data,
  });
}
