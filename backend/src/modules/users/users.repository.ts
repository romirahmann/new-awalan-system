import { Knex } from "knex";
import { UpdateUserData } from "./users.interface.js";
import dayjs from "dayjs";
import { RegisterData } from "../auth/auth.interface.js";

export const UsersRepository = (db: Knex) => ({
  register: async (data: RegisterData) => {
    return await db("users").insert({
      ...data,
      is_active: 1,
      updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  },
  getAll: async () => {
    return await db("users as u")
      .leftJoin("stores as s", "u.store_id", "s.id")
      .leftJoin("roles as r", "u.role_id", "r.id")
      .select(
        "u.id",
        "u.role_id",
        "u.store_id",
        "u.username",
        "u.full_name",
        "u.email",
        "u.last_login_at",
        "u.is_active",
        "u.created_at",
        "u.updated_at",

        "s.name as store_name",

        "r.name as role_name",
        "r.description as role_description",
      );
  },

  getById: async (id: number) => {
    const user = await db("users as u")
      .leftJoin("stores as s", "u.store_id", "s.id")
      .leftJoin("roles as r", "u.role_id", "r.id")
      .select(
        "u.id",
        "u.role_id",
        "u.store_id",
        "u.username",
        "u.full_name",
        "u.email",
        "u.last_login_at",
        "u.is_active",
        "u.created_at",
        "u.updated_at",

        "s.name as store_name",

        "r.name as role_name",
        "r.description as role_description",
      )
      .where("u.id", id)
      .first();

    if (!user) return null;

    const permissions = await db("role_permissions as rp")
      .leftJoin("permissions as p", "p.id", "rp.permission_id")
      .select("p.id", "p.code", "p.module")
      .where("rp.role_id", user.role_id);

    return {
      ...user,
      permissions,
    };
  },

  getByUsername: async (username: string) => {
    return await db("users").where({ username }).first();
  },

  updated: async (id: number, user: UpdateUserData) => {
    await db("users")
      .where({ id })
      .update({
        ...user,
        updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });

    return await db("users").where({ id }).first();
  },

  deleted: async (id: number) => {
    return await db("users").where({ id }).del();
  },
});
