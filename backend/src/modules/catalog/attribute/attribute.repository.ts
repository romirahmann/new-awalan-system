import type { Knex } from "knex";

import type {
  InsertAttributeValue,
  UpdateAttribute,
  UpdateAttributeValue,
} from "./attribute.interface.js";

export const AttributeRepository = (db: Knex) => {
  // Query baru setiap dipanggil agar filter tidak terbawa.
  const baseQueryAttribute = () =>
    db("attributes").select("id", "name", "description");

  const baseQueryAttributeValue = () =>
    db("attribute_values").select(
      "id",
      "attribute_id",
      "value",
      "sort_order",
      "created_at",
      "updated_at",
    );

  return {
    // ATTRIBUTE

    getAllAttributes: async () => {
      return baseQueryAttribute().orderBy("name", "asc").orderBy("id", "asc");
    },

    getAttributeById: async (id: number) => {
      return baseQueryAttribute().where("id", id).first();
    },

    updateAttribute: async (
      id: number,
      data: UpdateAttribute,
    ): Promise<number> => {
      // Hanya kolom yang boleh diubah.
      const changes: UpdateAttribute = {};

      if (data.name !== undefined) {
        changes.name = data.name;
      }

      if (data.description !== undefined) {
        changes.description = data.description;
      }

      if (Object.keys(changes).length === 0) {
        throw new Error("Tidak ada field attribute untuk diperbarui");
      }

      return db("attributes").where("id", id).update(changes);
    },

    deleteAttribute: async (id: number): Promise<number> => {
      return db("attributes").where("id", id).del();
    },

    // ATTRIBUTE VALUE

    getAllValues: async (attributeId?: number) => {
      const query = baseQueryAttributeValue();

      if (attributeId !== undefined) {
        query.where("attribute_id", attributeId);
      }

      return query
        .orderBy("attribute_id", "asc")
        .orderBy("sort_order", "asc")
        .orderBy("id", "asc");
    },

    getValueById: async (id: number) => {
      return baseQueryAttributeValue().where("id", id).first();
    },

    insertValues: async (data: InsertAttributeValue[]) => {
      return db("attribute_values").insert(data);
    },

    updateValue: async (
      id: number,
      data: UpdateAttributeValue,
    ): Promise<number> => {
      const changes: UpdateAttributeValue = {};

      if (data.value !== undefined) {
        changes.value = data.value;
      }

      if (data.sort_order !== undefined) {
        changes.sort_order = data.sort_order;
      }

      if (Object.keys(changes).length === 0) {
        throw new Error("Tidak ada field value untuk diperbarui");
      }

      return db("attribute_values")
        .where("id", id)
        .update({
          ...changes,
          updated_at: db.fn.now(),
        });
    },

    deleteValue: async (id: number): Promise<number> => {
      return db("attribute_values").where("id", id).del();
    },
  };
};

export type AttributeRepositoryType = ReturnType<typeof AttributeRepository>;
