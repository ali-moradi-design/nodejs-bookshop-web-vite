export interface PermissionRef {
  id: string;
  slug: string;
  name?: string;
  description?: string;
  section?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | PermissionRef[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: string[];
}

export type UpdateRoleInput = Partial<CreateRoleInput>;
