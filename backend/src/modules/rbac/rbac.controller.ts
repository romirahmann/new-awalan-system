import type { FastifyReply, FastifyRequest } from "fastify";

import type { RbacService } from "./rbac.service.js";
import type {
  insertRolePermission,
  UpdateDataPermission,
  UpdateDataRole,
} from "./rbac.interface.js";
import { success } from "../../libs/response.js";

export type RbacServiceType = ReturnType<typeof RbacService>;

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

export const RbacController = (service: RbacServiceType) => ({
  // ROLE

  getRoles: async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await service.getRoles();

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  getRoleById: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const data = await service.getRoleById(id);

    if (!data) {
      return reply.code(404).send({
        success: false,
        message: "Role tidak ditemukan",
      });
    }

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  updateRole: async (
    request: FastifyRequest<{
      Params: IdParams;
      Body: UpdateDataRole;
    }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const affectedRows = await service.updateRole(id, request.body);

    return reply.code(200).send({
      success: true,
      data: { affectedRows },
    });
  },

  deleteRole: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const message = await service.deleteRole(id);

    return reply.code(200).send({
      success: true,
      message,
    });
  },

  // PERMISSION

  getPermissions: async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await service.getPermissions();

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  getPermissionById: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const data = await service.getPermissionById(id);

    if (!data) {
      return reply.code(404).send({
        success: false,
        message: "Permission tidak ditemukan",
      });
    }

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  getPermissionByCode: async (
    request: FastifyRequest<{
      Params: { code: string };
    }>,
    reply: FastifyReply,
  ) => {
    const data = await service.getPermissionByCode(request.params.code);

    if (!data) {
      return reply.code(404).send({
        success: false,
        message: "Permission tidak ditemukan",
      });
    }

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  updatePermission: async (
    request: FastifyRequest<{
      Params: IdParams;
      Body: UpdateDataPermission;
    }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const affectedRows = await service.updatePermission(id, request.body);

    return reply.code(200).send({
      success: true,
      data: { affectedRows },
    });
  },

  deletePermission: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const message = await service.deletePermission(id);

    return reply.code(200).send({
      success: true,
      message,
    });
  },

  // ROLE PERMISSION

  getRolePermission: async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await service.getRolePermission();

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  getRolePermissionByRole: async (
    request: FastifyRequest<{
      Params: { idRole: string };
    }>,
    reply: FastifyReply,
  ) => {
    const idRole = parseId(request.params.idRole);
    const data = await service.getRolePermissionByRole(idRole);

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  getRolePermissionByPermission: async (
    request: FastifyRequest<{
      Params: { idPermission: string };
    }>,
    reply: FastifyReply,
  ) => {
    const idPermission = parseId(request.params.idPermission);

    const data = await service.getRolePermissionByPermission(idPermission);

    return reply.code(200).send({
      success: true,
      data,
    });
  },

  insertRolePermission: async (
    request: FastifyRequest<{ Body: insertRolePermission[] }>,
    reply: FastifyReply,
  ) => {
    const items = request.body;
    const insertRolePermession = await service.insertRolePermission(items);

    return success(reply, insertRolePermession, "Insert Successfully!");
  },
});
