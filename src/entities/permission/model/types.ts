export interface Permission {
  id: string;
  slug: string;
  name: string;
  description?: string;
  section: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionInput {
  slug: string;
  name: string;
  description?: string;
  section: string;
}

export type UpdatePermissionInput = Partial<CreatePermissionInput>;
