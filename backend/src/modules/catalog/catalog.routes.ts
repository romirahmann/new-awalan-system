import type { FastifyInstance } from "fastify";

import { CategoriesRepository } from "./categories/category.repository.js";
import { CategoryService } from "./categories/category.service.js";
import { CategoryController } from "./categories/category.controller.js";
import type {
  CreateCategory,
  UpdatedCategory,
} from "./categories/category.interface.js";

import { RbacGuard } from "../rbac/rbac.guard.js";
import { RbacService } from "../rbac/rbac.service.js";
import { RbacRepository } from "../rbac/rbac.repository.js";
import {
  InsertAttributeValue,
  UpdateAttribute,
  UpdateAttributeValue,
} from "./attribute/attribute.interface.js";
import { AttributeRepository } from "./attribute/attribute.repository.js";
import { AttributeService } from "./attribute/attribute.service.js";
import { AttributeController } from "./attribute/attribute.controller.js";

type IdParams = {
  id: string;
};

export default async function CatalogRoute(fastify: FastifyInstance) {
  // SETUP RBAC
  const rbacRepository = RbacRepository(fastify.db);
  const rbacService = RbacService(rbacRepository, fastify);

  // SETUP CATEGORY
  const categoryRepository = CategoriesRepository(fastify.db);
  const categoryService = CategoryService(categoryRepository, fastify);
  const categoryController = CategoryController(categoryService);

  // ATTRIBUTE
  const attributeRepository = AttributeRepository(fastify.db);
  const attributeService = AttributeService(attributeRepository, fastify);
  const attributeController = AttributeController(attributeService);

  // GET ALL CATEGORIES
  fastify.get(
    "/categories",
    {
      preHandler: RbacGuard(rbacService, "category.view"),
    },
    categoryController.getAllCategories,
  );

  // GET ACTIVE CATEGORIES
  fastify.get(
    "/categories/actived",
    {
      preHandler: RbacGuard(rbacService, "category.view"),
    },
    categoryController.getCategoryActive,
  );

  // GET CATEGORY BY ID
  fastify.get<{ Params: IdParams }>(
    "/category/:id",
    {
      preHandler: RbacGuard(rbacService, "category.view"),
    },
    categoryController.getCategoryById,
  );

  // CREATED CATEGORY
  fastify.post<{ Body: CreateCategory }>(
    "/category",
    {
      preHandler: RbacGuard(rbacService, "category.manage"),
    },
    categoryController.createdCategory,
  );

  // UPDATE CATEGORY
  fastify.patch<{
    Params: IdParams;
    Body: UpdatedCategory;
  }>(
    "/category/:id",
    {
      preHandler: RbacGuard(rbacService, "category.manage"),
    },
    categoryController.updatedCategory,
  );

  // DELETE CATEGORY
  fastify.delete<{ Params: IdParams }>(
    "/category/:id",
    {
      preHandler: RbacGuard(rbacService, "category.manage"),
    },
    categoryController.deletedCategory,
  );

  // GET ALL ATTRIBUTES
  fastify.get(
    "/attributes",
    {
      preHandler: RbacGuard(rbacService, "attribute.view"),
    },
    attributeController.getAllAttributes,
  );

  // GET ATTRIBUTE BY ID
  fastify.get<{ Params: IdParams }>(
    "/attributes/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.view"),
    },
    attributeController.getAttributeById,
  );

  // UPDATE ATTRIBUTE
  fastify.patch<{
    Params: IdParams;
    Body: UpdateAttribute;
  }>(
    "/attributes/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.manage"),
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            name: {
              type: "string",
              minLength: 1,
              pattern: "\\S",
            },
            description: {
              type: ["string", "null"],
            },
          },
        },
      },
    },
    attributeController.updateAttribute,
  );

  // DELETE ATTRIBUTE
  fastify.delete<{ Params: IdParams }>(
    "/attributes/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.manage"),
    },
    attributeController.deleteAttribute,
  );

  // GET ALL VALUES
  // Filter opsional: /attribute-values?attribute_id=1
  fastify.get<{
    Querystring: { attribute_id?: string };
  }>(
    "/attribute-values",
    {
      preHandler: RbacGuard(rbacService, "attribute.view"),
      schema: {
        querystring: {
          type: "object",
          properties: {
            attribute_id: {
              type: "string",
              pattern: "^[0-9]+$",
            },
          },
        },
      },
    },
    attributeController.getAllValues,
  );

  // GET VALUE BY ID
  fastify.get<{ Params: IdParams }>(
    "/attribute-values/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.view"),
    },
    attributeController.getValueById,
  );

  fastify.post<{ Body: InsertAttributeValue[] }>(
    "/attribute-value",
    {
      preHandler: RbacGuard(rbacService, "attribute.manage"),
    },
    attributeController.insertValue,
  );

  // UPDATE VALUE
  fastify.patch<{
    Params: IdParams;
    Body: UpdateAttributeValue;
  }>(
    "/attribute-values/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.manage"),
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            value: {
              type: "string",
              minLength: 1,
              pattern: "\\S",
            },
            sort_order: {
              type: "integer",
              minimum: 0,
              maximum: Number.MAX_SAFE_INTEGER,
            },
          },
        },
      },
    },
    attributeController.updateValue,
  );

  // DELETE VALUE
  fastify.delete<{ Params: IdParams }>(
    "/attribute-values/:id",
    {
      preHandler: RbacGuard(rbacService, "attribute.manage"),
    },
    attributeController.deleteValue,
  );
}
