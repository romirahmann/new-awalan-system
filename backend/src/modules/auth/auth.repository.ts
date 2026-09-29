import { Knex } from "knex";
import { LoginData, RegisterData } from "./auth.interface.js";
import dayjs from "dayjs";

export const AuthRepository = (db: Knex) => ({
  login: async (username: string) => {
    const users = await db("users as u")
      .leftJoin("stores as s", "u.store_id", "s.id")
      .leftJoin("roles as r", "u.role_id", "r.id")

      .select(
        "u.id",
        "u.role_id",
        "u.store_id",
        "u.username",
        "u.full_name",
        "u.email",
        "u.password",
        "u.last_login_at",
        "u.is_active",
        "u.created_at",
        "u.updated_at",

        "s.name as store_name",

        "r.name as role_name",
        "r.description as role_description",
      )
      .where("u.username", username)
      .first();

    const permissions = await db("role_permissions as rp")
      .leftJoin("permissions as p", "p.id", "rp.permission_id")
      .select("p.code as permission_code", "p.module as permission_module")
      .where("rp.role_id", users.role_id);

    const payload = {
      ...users,
      permissions,
    };

    return payload;
  },
  lastLogin: async (username: string) => {
    return await db("users")
      .where("username", username)
      .update({
        last_login_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
  },
});
