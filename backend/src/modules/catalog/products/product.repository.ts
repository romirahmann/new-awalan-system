import type { Knex } from "knex";
import type {
  InsertProduct,
  UpdateProduct,
  InsertProductVariant,
  UpdateProductVariant,
  InsertVariantAttributeValue,
} from "./product.interface.js";

export const ProductRepository = (db: Knex) => {
  const BaseProductQuery = (trx?: Knex.Transaction) =>
    (trx ?? db)("products as p").select(
      "p.id",
      "p.category_id",
      "p.name",
      "p.image",
      "p.description",
      "p.is_active",
    );

  const BaseVariantQuery = (trx?: Knex.Transaction) =>
    (trx ?? db)("product_variants as pv").select(
      "pv.id",
      "pv.product_id",
      "pv.sku",
      "pv.cost_price",
      "pv.selling_price",
      "pv.is_default",
      "pv.is_active",
      "pv.barcode",
      "pv.created_at",
      "pv.updated_at",
    );

  return {
    // PRODUCTS
    getAllProducts: async (trx?: Knex.Transaction) => {
      return BaseProductQuery(trx).orderBy("p.id", "desc");
    },

    getProductById: async (id: number, trx?: Knex.Transaction) => {
      return BaseProductQuery(trx).where("p.id", id).first();
    },

    insertProduct: async (
      data: InsertProduct,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      const [id] = await (trx ?? db)("products").insert(data);
      return id;
    },

    updatedProduct: async (
      id: number,
      data: UpdateProduct,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("products").where("id", id).update(data);
    },

    deleteProduct: async (
      id: number,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("products").where("id", id).del();
    },

    // PRODUCT VARIANTS
    getVariantsByProductId: async (
      productId: number,
      trx?: Knex.Transaction,
    ) => {
      return BaseVariantQuery(trx)
        .where("pv.product_id", productId)
        .orderBy("pv.is_default", "desc")
        .orderBy("pv.id", "asc");
    },

    getVariantById: async (
      productId: number,
      variantId: number,
      trx?: Knex.Transaction,
    ) => {
      return BaseVariantQuery(trx)
        .where("pv.product_id", productId)
        .where("pv.id", variantId)
        .first();
    },

    getVariantBySku: async (sku: string, trx?: Knex.Transaction) => {
      return BaseVariantQuery(trx).where("pv.sku", sku).first();
    },

    insertVariant: async (
      data: InsertProductVariant,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      const [id] = await (trx ?? db)("product_variants").insert(data);

      return id;
    },

    updateVariant: async (
      productId: number,
      variantId: number,
      data: UpdateProductVariant,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("product_variants")
        .where("product_id", productId)
        .where("id", variantId)
        .update(data);
    },

    deleteVariant: async (
      productId: number,
      variantId: number,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("product_variants")
        .where("product_id", productId)
        .where("id", variantId)
        .del();
    },

    clearDefaultVariants: async (
      productId: number,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("product_variants")
        .where("product_id", productId)
        .update({ is_default: false });
    },

    // VARIANT ATTRIBUTE VALUES
    getAttributeValuesByVariantId: async (
      variantId: number,
      trx?: Knex.Transaction,
    ) => {
      return (trx ?? db)("variant_attribute_values as vav")
        .join("attribute_values as av", "vav.attribute_value_id", "av.id")
        .join("attributes as a", "av.attribute_id", "a.id")
        .select(
          "vav.id",
          "vav.variant_id",
          "vav.attribute_value_id",
          "a.id as attribute_id",
          "a.name as attribute_name",
          "av.value",
          "av.sort_order",
        )
        .where("vav.variant_id", variantId)
        .orderBy("a.id", "asc")
        .orderBy("av.sort_order", "asc");
    },

    // Ambil atribut seluruh variants suatu produk dalam satu query.
    getVariantAttributeValuesByProductId: async (
      productId: number,
      trx?: Knex.Transaction,
    ) => {
      return (trx ?? db)("variant_attribute_values as vav")
        .join("product_variants as pv", "vav.variant_id", "pv.id")
        .join("attribute_values as av", "vav.attribute_value_id", "av.id")
        .join("attributes as a", "av.attribute_id", "a.id")
        .select(
          "vav.id",
          "vav.variant_id",
          "vav.attribute_value_id",
          "a.id as attribute_id",
          "a.name as attribute_name",
          "av.value",
          "av.sort_order",
        )
        .where("pv.product_id", productId)
        .orderBy("vav.variant_id", "asc")
        .orderBy("a.id", "asc")
        .orderBy("av.sort_order", "asc");
    },

    insertVariantAttributeValues: async (
      data: InsertVariantAttributeValue[],
      trx?: Knex.Transaction,
    ) => {
      return (trx ?? db)("variant_attribute_values").insert(data);
    },

    deleteAttributeValuesByVariantId: async (
      variantId: number,
      trx?: Knex.Transaction,
    ): Promise<number> => {
      return (trx ?? db)("variant_attribute_values")
        .where("variant_id", variantId)
        .del();
    },
    getProductForUpdate: async (id: number, trx: Knex.Transaction) => {
      return trx("products").where("id", id).forUpdate().first();
    },

    getAttributeValuesByIds: async (ids: number[], trx: Knex.Transaction) => {
      return trx("attribute_values")
        .select<{ id: number; attribute_id: number }[]>("id", "attribute_id")
        .whereIn("id", ids)
        .forShare();
    },
  };
};

export type ProductRepositoryType = ReturnType<typeof ProductRepository>;
