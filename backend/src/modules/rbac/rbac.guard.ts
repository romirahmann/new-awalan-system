import { FastifyReply, FastifyRequest } from "fastify";
import { RbacRepositoryType } from "./rbac.service.js";
import { RbacServiceType } from "./rbac.controller.js";

export const RbacGuard = (service: RbacServiceType, permissionCode: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const roleId = request.user?.role_id;
    request.log.info({
      cookieNames: Object.keys(request.cookies ?? {}),
      hasCookieHeader: Boolean(request.headers.cookie),
      hasAuthorizationHeader: Boolean(request.headers.authorization),
    });
    if (
      typeof roleId !== "number" ||
      !Number.isInteger(roleId) ||
      roleId <= 0
    ) {
      return reply.code(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    console.log("PERMISSION CODE ====> ", permissionCode);
    const permission = await service.getPermissionByCode(permissionCode);

    console.log(permission, roleId);

    const allowed = await service.hashPermission(roleId, permission.id);

    console.log("ALLOWED GUARD", allowed);

    if (!allowed) {
      return reply.code(403).send({
        success: false,
        message: "Kamu tidak memiliki izin!",
      });
    }
  };
};
