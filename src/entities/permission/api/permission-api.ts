import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage } from '@/shared/api';
import type { CreatePermissionInput, Permission, UpdatePermissionInput } from '../model/types';

export const permissionKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionKeys.all, 'list'] as const,
};

export const fetchPermissions = () => apiGet<ApiData<Permission[]>>('/permissions');

export const createPermission = (input: CreatePermissionInput) =>
  apiPost<ApiData<Permission>>('/permissions', input);

export const updatePermission = (id: string, input: UpdatePermissionInput) =>
  apiPatch<ApiData<Permission>>(`/permissions/${id}`, input);

export const deletePermission = (id: string) => apiDelete<ApiMessage>(`/permissions/${id}`);
