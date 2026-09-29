import { FastifyInstance } from "fastify";
import { CategoriesRepository } from "./category.repository.js";
import { CreateCategory, UpdatedCategory } from "./category.interface.js";

export type CategoriesRepositoryType = ReturnType<typeof CategoriesRepository>;

export const CategoryService = (
  repository: CategoriesRepositoryType,
  fastify: FastifyInstance,
) => ({
  getAllCategory: async () => {
    const categories = await repository.getAll();
    return categories;
  },
  getCategoriesActive: async () => {
    const categories = await repository.getCategoryActived();
    return categories;
  },
  getCategoryById: async (id: number) => {
    const categories = await repository.getById(id);
    return categories;
  },
  createCategory: async (data: CreateCategory) => {
    const category = await repository.created(data);
    return category;
  },
  updatedCategory: async (id: number, data: UpdatedCategory) => {
    const rows = await repository.updated(id, data);
    return rows;
  },
  deletedCategory: async (id: number) => {
    const rows = await repository.deleted(id);
    return rows;
  },
});
