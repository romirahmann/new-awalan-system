import type { Knex } from "knex";
import type { UpdateDataPermission, UpdateDataRole } from "./rbac.interface.js";

export const RbacRepository = (db: Knex) => {
  // Query baru setiap dipanggil agar filter tidak saling terbawa.
  const rolePermissionQuery = () =>
    db("role_permissions as rp")
      .leftJoin("roles as r", "r.id", "rp.role_id")
      .leftJoin("permissions as p", "p.id", "rp.permission_id")
      .select(
        "rp.id",
        "rp.role_id",
        "rp.permission_id",
        "r.name",
        "r.description as role_desc",
        "r.is_active",
        "p.code",
        "p.module",
        "p.description as permission_desc",
      );

  return {
    // ROLES
    getRoles: async () => {
      return db("roles").select("*");
    },

    getRoleByRoleName: async (name: string) => {
      return db("roles")
        .select("id", "name", "description", "is_active")
        .where("name", name)
        .first();
    },

    getRoleById: async (id: number) => {
      return db("roles")
        .select("id", "name", "description", "is_active")
        .where("id", id)
        .first();
    },

    updateRole: async (id: number, data: UpdateDataRole) => {
      return db("roles").where("id", id).update(data);
    },

    deleteRole: async (id: number) => {
      return db.transaction(async (trx) => {
        await trx("role_Permission").where("role_id", id).del();

        return trx("roles").where("id", id).del();
      });
    },

    // ROLE PERMISSION
    getRolePermission: async () => {
      return rolePermissionQuery();
    },

    getRolePermissionByRole: async (idRole: number) => {
      return rolePermissionQuery().where("rp.role_id", idRole);
    },

    getRolePermissionByPermission: async (idPermission: number) => {
      return rolePermissionQuery().where("rp.Permission_id", idPermission);
    },

    hashPermission: async (roleId: number, permissionId: number) => {
      return rolePermissionQuery()
        .where("rp.role_id", roleId)
        .andWhere("rp.permission_id", permissionId);
    },

    insertRolePermission: async (
      relations: {
        role_id: number;
        permission_id: number;
      }[],
    ) => {
      return await db.transaction(async (trx) => {
        return trx("role_permissions").insert(relations);
      });
    },

    // PERMISSIONS
    getPermissions: async () => {
      return db("permissions").select("*");
    },

    getPermissionById: async (id: number) => {
      return db("permissions")
        .select("id", "code", "module", "description")
        .where("id", id)
        .first();
    },

    getPermissionByCode: async (code: string) => {
      return db("permissions")
        .select("id", "code", "module", "description")
        .where("code", code)
        .first();
    },

    updatePermission: async (id: number, data: UpdateDataPermission) => {
      return db("permissions").where("id", id).update(data);
    },

    deletePermission: async (id: number) => {
      return db.transaction(async (trx) => {
        await trx("role_Permission").where("Permission_id", id).del();

        return trx("permissions").where("id", id).del();
      });
    },
  };
};
