import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage } from '@/shared/api';
import type { CreateRoleInput, Role, UpdateRoleInput } from '../model/types';

export const roleKeys = {
  all: ['roles'] as const,
  list: () => [...roleKeys.all, 'list'] as const,
};

export const fetchRoles = () => apiGet<ApiData<Role[]>>('/roles');

export const createRole = (input: CreateRoleInput) => apiPost<ApiData<Role>>('/roles', input);

export const updateRole = (id: string, input: UpdateRoleInput) =>
  apiPatch<ApiData<Role>>(`/roles/${id}`, input);

export const deleteRole = (id: string) => apiDelete<ApiMessage>(`/roles/${id}`);
