import { FastifyInstance } from "fastify";
import AuthRoute from "../modules/auth/auth.routes.js";
import UserRoute from "../modules/users/user.routes.js";
import { authGuard } from "../modules/auth/auth.guard.js";
import { RbacGuard } from "../modules/rbac/rbac.guard.js";
import { RbacService } from "../modules/rbac/rbac.service.js";
import { RbacRepository } from "../modules/rbac/rbac.repository.js";
import RbacRoute from "../modules/rbac/rbac.routes.js";
import CatalgoRoute from "../modules/catalog/catalog.routes.js";

export default async function (fastify: FastifyInstance) {
  fastify.register(AuthRoute, { prefix: "/auth" });

  const rbacRepository = RbacRepository(fastify.db);
  const rbacService = RbacService(rbacRepository, fastify);

  // ROUTE USERS
  fastify.register(async (app) => {
    app.addHook("preHandler", authGuard);
    app.register(
      async (usersApp) => {
        usersApp.addHook("preHandler", RbacGuard(rbacService, "user.manage"));
        usersApp.register(UserRoute);
      },
      { prefix: "/users" },
    );
    app.register(
      async (rbacApp) => {
        rbacApp.addHook("preHandler", RbacGuard(rbacService, "role.manage"));
        rbacApp.register(RbacRoute);
      },
      { prefix: "/rbac" },
    );
    app.register(CatalgoRoute);
  });
}
