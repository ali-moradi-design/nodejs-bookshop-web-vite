export interface RoleRef {
  id: string;
  name: string;
  description?: string;
  permissions?: string[] | { id: string; slug: string; name?: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Array<string | RoleRef>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
  isActive?: boolean;
}

export const getRoleNames = (user: User | null | undefined): string[] => {
  if (!user?.roles) return [];
  return user.roles.map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean);
};

export const userHasRole = (user: User | null | undefined, role: string): boolean =>
  getRoleNames(user).includes(role);

export const isAdminUser = (user: User | null | undefined): boolean => userHasRole(user, 'admin');
