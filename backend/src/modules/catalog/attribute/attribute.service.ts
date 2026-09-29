import { FastifyInstance } from "fastify";
import { AttributeRepositoryType } from "./attribute.repository.js";
import {
  InsertAttributeValue,
  UpdateAttribute,
  UpdateAttributeValue,
} from "./attribute.interface.js";
import { isArray } from "node:util";

// VALIDATE ID
const validateId = (id: number) => {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("ID harus berupa bilangan bulat positif");
  }
};

export const AttributeService = (
  repository: AttributeRepositoryType,
  fastify: FastifyInstance,
) => ({
  getAllAttributes: async () => {
    return repository.getAllAttributes();
  },
  getAttributesById: async (id: number) => {
    validateId(id);

    const attribute = await repository.getAttributeById(id);
    return attribute;
  },
  updatedAttribute: async (id: number, data: UpdateAttribute) => {
    validateId(id);

    const changes: UpdateAttribute = {};
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) {
        throw new Error("Nama Attribute tidak boleh kosong");
      }
      changes.name = name;
    }
    if (data.description !== undefined) {
      changes.description =
        data.description === null ? null : data.description.trim();
    }

    if (Object.keys(changes).length === 0) {
      throw new Error("Tidak ada data attribute untuk diperbarui");
    }

    const attribute = await repository.getAttributeById(id);
    if (!attribute) {
      throw new Error("Attribute tidak ditemukan!");
    }
    return repository.updateAttribute(id, changes);
  },
  deleteAttribute: async (id: number) => {
    validateId(id);
    const rows = await repository.deleteAttribute(id);
    return rows;
  },

  //   ATTRIBUTE VALUES
  getAllValues: async (attributeId?: number) => {
    if (attributeId !== undefined) {
      validateId(attributeId);

      const attribute = await repository.getAttributeById(attributeId);

      if (!attribute) {
        throw new Error("Value Attribute tidak ditemukan");
      }

      return attribute;
    }

    return await repository.getAllValues();
  },

  getValuesById: async (id: number) => {
    validateId(id);

    const value = await repository.getValueById(id);
    return value;
  },

  insertValues: async (data: InsertAttributeValue | InsertAttributeValue[]) => {
    console.log("DATA: ");
    const items = Array.isArray(data) ? data : [data];

    if (items.length === 0) {
      throw new Error("Data value attribute tidak boleh kosong!");
    }

    const checkedAttributeIds = new Set<number>();
    const seenValues = new Set<string>();
    const changes: InsertAttributeValue[] = [];

    for (const item of items) {
      console.log(item, typeof item);
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error("Data Value Attribute harus berupa objek");
      }
      validateId(item.attribute_id);

      if (typeof item.value !== "string" || !item.value.trim()) {
        throw new Error("Value attribute tidak boleh kosong");
      }

      const value = item.value.trim();
      const sortOrder = item.sort_order ?? 0;

      if (!checkedAttributeIds.has(item.attribute_id)) {
        const attribute = await repository.getAttributeById(item.attribute_id);
        if (!attribute) {
          throw new Error(
            `Attribute dengan ID ${item.attribute_id} tidak ditemukan`,
          );
        }
        checkedAttributeIds.add(item.attribute_id);
      }

      const key = JSON.stringify([item.attribute_id, value]);
      if (seenValues.has(key)) {
        throw new Error(
          `Value "${value}" duplikat untuk attribute ID ${item.attribute_id} `,
        );
      }

      seenValues.add(key);
      changes.push({
        attribute_id: item.attribute_id,
        value,
        sort_order: sortOrder,
      });
    }
    return await repository.insertValues(changes);
  },

  updateValue: async (id: number, data: UpdateAttributeValue) => {
    validateId(id);
    const changes: UpdateAttributeValue = {};
    if (data.value !== undefined) {
      const value = data.value.trim();
      if (!value) {
        throw new Error("Value attribute tidak boleh kosong!");
      }
      changes.value = value;
    }

    if (data.sort_order !== undefined) {
      if (!Number.isSafeInteger(data.sort_order) || data.sort_order < 0) {
        throw new Error("Urutan harus berupa bilangan bulat nol atau lebih");
      }
      changes.sort_order = data.sort_order;
    }
    if (Object.keys(changes).length === 0) {
      throw new Error("Tidak ada data value yang diperbaharui");
    }
    const value = await repository.getValueById(id);
    if (!value) {
      throw new Error("Value attribute tidak ditemukan!");
    }
    return repository.updateValue(id, changes);
  },
  deleteValue: async (id: number) => {
    validateId(id);
    const rows = await repository.deleteValue(id);
    return rows;
  },
});

export type AttributeServiceType = ReturnType<typeof AttributeService>;
