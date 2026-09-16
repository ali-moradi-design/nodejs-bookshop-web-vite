import { useQuery } from '@tanstack/react-query';
import { roleKeys, fetchRoles } from './role-api';

export function useRolesQuery() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: async () => (await fetchRoles()).data,
  });
}
