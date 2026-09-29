import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryService } from "./category.service.js";
import { CreateCategory, UpdatedCategory } from "./category.interface.js";
import { success } from "../../../libs/response.js";

export type CategoryServiceType = ReturnType<typeof CategoryService>;

type IdParams = {
  id: string;
};

// Parameter URL masuk sebagai string.
// Tolak ID yang bukan bilangan bulat positif.
const parseId = (value: string): number => {
  const id = Number(value);

  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error("ID harus berupa bilangan bulat positif"), {
      statusCode: 400,
    });
  }

  return id;
};

export const CategoryController = (service: CategoryServiceType) => ({
  getAllCategories: async (request: FastifyRequest, reply: FastifyReply) => {
    const categories = await service.getAllCategory();
    return success(reply, categories);
  },
  getCategoryActive: async (request: FastifyRequest, reply: FastifyReply) => {
    const categories = await service.getCategoriesActive();
    return success(reply, categories);
  },
  getCategoryById: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const category = await service.getCategoryById(id);
    return success(reply, category);
  },
  createdCategory: async (
    request: FastifyRequest<{ Body: CreateCategory }>,
    reply: FastifyReply,
  ) => {
    const data = request.body;

    const rows = await service.createCategory(data);
    return success(reply, rows, "Created Category Successfully!");
  },
  updatedCategory: async (
    request: FastifyRequest<{ Params: IdParams; Body: UpdatedCategory }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const data = request.body;
    const rows = await service.updatedCategory(id, data);
    return success(reply, rows, "Updated Successfully!");
  },
  deletedCategory: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const rows = await service.deletedCategory(id);
    success(reply, rows, "Deleted Successfully!");
  },
});
