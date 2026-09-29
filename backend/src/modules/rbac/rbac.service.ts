import fastify, { FastifyInstance } from "fastify";
import { RbacRepository } from "./rbac.repository.js";
import {
  insertRolePermission,
  UpdateDataPermission,
  UpdateDataRole,
} from "./rbac.interface.js";
export type RbacRepositoryType = ReturnType<typeof RbacRepository>;

export const RbacService = (
  repository: RbacRepositoryType,
  fastify: FastifyInstance,
) => ({
  // ROLE
  getRoles: async () => {
    const roles = await repository.getRoles();
    return roles;
  },

  getRoleById: async (id: number) => {
    const roles = await repository.getRoleById(id);
    return roles;
  },

  getRoleByRoleName: async (name: string) => {
    const roles = await repository.getRoleByRoleName(name);
    return roles;
  },

  updateRole: async (id: number, data: UpdateDataRole) => {
    const roles = await repository.updateRole(id, data);
    return roles;
  },

  deleteRole: async (id: number) => {
    await repository.deleteRole(id);
    return "Deleted Successfully!";
  },

  // PERMISSION
  getPermissions: async () => {
    const Permissions = await repository.getPermissions();
    return Permissions;
  },

  getPermissionById: async (id: number) => {
    const Permission = await repository.getPermissionById(id);
    return Permission;
  },

  getPermissionByCode: async (code: string) => {
    console.log("CONSOLE LOG DARI SERVICE ===> ", code);
    const Permission = await repository.getPermissionByCode(code);
    return Permission;
  },

  updatePermission: async (id: number, data: UpdateDataPermission) => {
    const Permission = await repository.updatePermission(id, data);
    return Permission;
  },

  deletePermission: async (id: number) => {
    await repository.deletePermission(id);
    return "Deleted Successfully!";
  },

  // ROLE PERMISSION
  getRolePermission: async () => {
    const rolePermissions = await repository.getRolePermission();
    return rolePermissions;
  },

  getRolePermissionByRole: async (idRole: number) => {
    const rolePermissions = await repository.getRolePermissionByRole(idRole);
    return rolePermissions;
  },

  getRolePermissionByPermission: async (idPermission: number) => {
    const rolePermissions =
      await repository.getRolePermissionByPermission(idPermission);
    return rolePermissions;
  },

  hashPermission: async (roleId: number, permissionId: number) => {
    const rows = await repository.hashPermission(roleId, permissionId);
    return rows.length > 0;
  },
  insertRolePermission: async (items: insertRolePermission[]) => {
    const relations = [];

    for (const item of items) {
      const roleName = item.role_name.trim();
      const permissionCode = item.permission_code.trim();

      if (!roleName || !permissionCode) {
        throw Object.assign(
          new Error("role_name dan permission_code tidak boleh kosong"),
          { statusCode: 400 },
        );
      }

      const role = await repository.getRoleByRoleName(roleName);

      if (!role) {
        throw Object.assign(new Error(`Role "${roleName}" tidak ditemukan`), {
          statusCode: 404,
        });
      }

      const permission = await repository.getPermissionByCode(permissionCode);

      if (!permission) {
        throw Object.assign(
          new Error(`Permission "${permissionCode}" tidak ditemukan`),
          { statusCode: 404 },
        );
      }

      relations.push({
        role_id: role.id,
        permission_id: permission.id,
      });
    }

    return await repository.insertRolePermission(relations);
  },
});
