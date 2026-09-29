import type { FastifyReply, FastifyRequest } from "fastify";

import type { AttributeServiceType } from "./attribute.service.js";
import type {
  InsertAttributeValue,
  UpdateAttribute,
  UpdateAttributeValue,
} from "./attribute.interface.js";

import { success } from "../../../libs/response.js";

type IdParams = {
  id: string;
};

type ValueQuery = {
  attribute_id?: string;
};

const parseId = (value: string): number => {
  const id = Number(value);

  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error("ID harus berupa bilangan bulat positif"), {
      statusCode: 400,
    });
  }

  return id;
};

export const AttributeController = (service: AttributeServiceType) => ({
  // ATTRIBUTE

  getAllAttributes: async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("CONTROLLER");
    const attributes = await service.getAllAttributes();

    return success(reply, attributes);
  },

  getAttributeById: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const attribute = await service.getAttributesById(id);

    return success(reply, attribute);
  },

  updateAttribute: async (
    request: FastifyRequest<{
      Params: IdParams;
      Body: UpdateAttribute;
    }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);

    // Hanya teruskan field yang boleh diubah.
    const data: UpdateAttribute = {};

    if (request.body.name !== undefined) {
      data.name = request.body.name;
    }

    if (request.body.description !== undefined) {
      data.description = request.body.description;
    }

    const rows = await service.updatedAttribute(id, data);

    return success(reply, rows, "Updated Successfully!");
  },

  deleteAttribute: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const rows = await service.deleteAttribute(id);

    return success(reply, rows, "Deleted Successfully!");
  },

  // ATTRIBUTE VALUE

  getAllValues: async (
    request: FastifyRequest<{ Querystring: ValueQuery }>,
    reply: FastifyReply,
  ) => {
    const rawAttributeId = request.query.attribute_id;

    const attributeId =
      rawAttributeId === undefined ? undefined : parseId(rawAttributeId);

    const values = await service.getAllValues(attributeId);

    return success(reply, values);
  },

  getValueById: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const value = await service.getValuesById(id);

    return success(reply, value);
  },

  insertValue: async (
    request: FastifyRequest<{
      Body: InsertAttributeValue[];
    }>,
    reply: FastifyReply,
  ) => {
    const data = request.body;
    const rows = await service.insertValues(data);
    return success(reply, rows);
  },

  updateValue: async (
    request: FastifyRequest<{
      Params: IdParams;
      Body: UpdateAttributeValue;
    }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);

    // attribute_id tidak boleh diganti lewat endpoint ini.
    const data: UpdateAttributeValue = {};

    if (request.body.value !== undefined) {
      data.value = request.body.value;
    }

    if (request.body.sort_order !== undefined) {
      data.sort_order = request.body.sort_order;
    }

    const rows = await service.updateValue(id, data);

    return success(reply, rows, "Updated Successfully!");
  },

  deleteValue: async (
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) => {
    const id = parseId(request.params.id);
    const rows = await service.deleteValue(id);

    return success(reply, rows, "Deleted Successfully!");
  },
});
