import { Knex } from "knex";
import { CreateCategory, UpdatedCategory } from "./category.interface.js";

export const CategoriesRepository = (db: Knex) => {
  const baseQuery = () =>
    db("categories").select("id", "name", "description", "type");

  return {
    getAll: async () => {
      return baseQuery();
    },
    getCategoryActived: async () => {
      return baseQuery().where("is_active", 1);
    },
    getById: async (id: number) => {
      return baseQuery().where("id", id).first();
    },
    getByName: async (name: string) => {
      return baseQuery().where("name", name).first();
    },
    updated: async (id: number, data: UpdatedCategory) => {
      return baseQuery().where("id", id).update(data);
    },
    deleted: async (id: number) => {
      return baseQuery().where("id", id).delete();
    },
    created: async (data: CreateCategory) => {
      return baseQuery().insert({ ...data, is_active: 1 });
    },
  };
};
