export interface UpdateDataRole {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateDataPermission {
  code?: string;
  module?: string;
  description?: string;
}

export interface insertRolePermission {
  role_name: string;
  permission_code: string;
}
