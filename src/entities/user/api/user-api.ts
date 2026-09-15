import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage } from '@/shared/api';
import type { AuthResponse, CreateUserInput, UpdateUserInput, User } from '../model/types';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export const login = (email: string, password: string) =>
  apiPost<AuthResponse>('/auth/login', { email, password }, { skipRefresh: true });

export const register = (input: { name: string; email: string; password: string }) =>
  apiPost<AuthResponse>('/auth/register', input, { skipRefresh: true });

export const logout = () => apiPost<{ message: string }>('/auth/logout', {}, { skipRefresh: true });

export const refreshSession = () =>
  apiPost<AuthResponse>('/auth/refresh', {}, { skipRefresh: true });

export const fetchMe = () => apiGet<ApiData<User>>('/users/me');

export const fetchUsers = () => apiGet<ApiData<User[]>>('/users');

export const fetchUser = (id: string) => apiGet<ApiData<User>>(`/users/${id}`);

export const createUser = (input: CreateUserInput) => apiPost<ApiData<User>>('/users', input);

export const updateUser = (id: string, input: UpdateUserInput) =>
  apiPatch<ApiData<User>>(`/users/${id}`, input);

export const deleteUser = (id: string) => apiDelete<ApiMessage>(`/users/${id}`);
