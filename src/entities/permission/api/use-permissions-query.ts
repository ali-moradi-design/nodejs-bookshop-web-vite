import { useQuery } from '@tanstack/react-query';
import { permissionKeys, fetchPermissions } from './permission-api';

export function usePermissionsQuery() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: async () => (await fetchPermissions()).data,
  });
}
