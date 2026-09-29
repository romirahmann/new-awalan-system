import type { FastifyInstance } from "fastify";

import { RbacRepository } from "./rbac.repository.js";
import { RbacService } from "./rbac.service.js";
import { RbacController } from "./rbac.controller.js";
import { insertRolePermessionSchema } from "./rbac.schema.js";

export default async function RbacRoute(fastify: FastifyInstance) {
  const repository = RbacRepository(fastify.db);
  const service = RbacService(repository, fastify);
  const controller = RbacController(service);

  // ROLE

  fastify.get("/roles", controller.getRoles);

  fastify.get("/roles/:id", controller.getRoleById);

  fastify.patch("/roles/:id", controller.updateRole);

  fastify.delete("/roles/:id", controller.deleteRole);

  // PERMISSION

  fastify.get("/permissions", controller.getPermissions);

  fastify.get("/permissions/code/:code", controller.getPermissionByCode);

  fastify.get("/permissions/:id", controller.getPermissionById);

  fastify.patch("/permissions/:id", controller.updatePermission);

  fastify.delete("/permissions/:id", controller.deletePermission);

  // ROLE PERMISSION

  fastify.get("/role-permissions", controller.getRolePermission);

  fastify.get(
    "/role-permissions/role/:idRole",
    controller.getRolePermissionByRole,
  );

  fastify.get(
    "/role-permissions/permission/:idPermission",
    controller.getRolePermissionByPermission,
  );
  fastify.post(
    "/role/permission",
    { schema: insertRolePermessionSchema },
    controller.insertRolePermission,
  );
}
