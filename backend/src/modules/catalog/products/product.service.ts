import type { Knex } from "knex";
import type { ProductRepositoryType } from "./product.repository.js";
import type {
  InsertProduct,
  UpdateProduct,
  InsertProductVariant,
  CreateProductBody,
  CreateProductVariantBody,
  UpdateProductVariantBody,
} from "./product.interface.js";

type CategoryLookup = {
  getCategoryById: (id: number, trx?: Knex.Transaction) => Promise<unknown>;
};

// Bentuk hasil query MySQL.
// DECIMAL dapat dikembalikan sebagai string.
type VariantRow = Omit<
  InsertProductVariant,
  "cost_price" | "selling_price" | "is_default" | "is_active"
> & {
  id: number;
  cost_price: number | string;
  selling_price: number | string;
  is_default: boolean | number;
  is_active: boolean | number;
};

type VariantLink = {
  id: number;
  variant_id: number;
  attribute_value_id: number;
  attribute_id: number;
  attribute_name: string;
  value: string;
  sort_order: number;
};

type PreparedVariant = {
  row: Omit<InsertProductVariant, "product_id">;
  attributeValueIds: number[];
};

export class ProductServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

// VALIDATION HELPERS
const validateObject = (value: unknown, label: string) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ProductServiceError(`${label} harus berupa objek`);
  }
};

const validateId = (value: number, label = "ID") => {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new ProductServiceError(
      `${label} harus berupa bilangan bulat positif`,
    );
  }
};

const normalizeText = (
  value: unknown,
  label: string,
  maxLength: number,
): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ProductServiceError(`${label} tidak boleh kosong`);
  }

  const result = value.trim();

  if ([...result].length > maxLength) {
    throw new ProductServiceError(`${label} maksimal ${maxLength} karakter`);
  }

  return result;
};

const normalizeNullableText = (
  value: unknown,
  label: string,
  maxLength?: number,
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ProductServiceError(`${label} harus berupa string atau null`);
  }

  const result = value.trim();

  if (maxLength !== undefined && [...result].length > maxLength) {
    throw new ProductServiceError(`${label} maksimal ${maxLength} karakter`);
  }

  return result || null;
};

const normalizeDescription = (value: unknown): string | null => {
  const result = normalizeNullableText(value, "Deskripsi");

  // Batas kolom MySQL TEXT dalam byte.
  if (result !== null && Buffer.byteLength(result, "utf8") > 65535) {
    throw new ProductServiceError("Deskripsi terlalu panjang");
  }

  return result;
};

const validateBoolean = (value: unknown, label: string): boolean => {
  if (typeof value !== "boolean") {
    throw new ProductServiceError(`${label} harus berupa boolean`);
  }

  return value;
};

const validateMoney = (value: unknown, label: string): number => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 9999999999999.99 ||
    !/^\d+(\.\d{1,2})?$/.test(String(value))
  ) {
    throw new ProductServiceError(
      `${label} harus berupa angka nonnegatif dengan maksimal 2 angka desimal`,
    );
  }

  return value;
};

const normalizeAttributeIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    throw new ProductServiceError("attribute_value_ids harus berupa array");
  }

  const ids: number[] = [];

  for (const id of value) {
    validateId(id, "ID attribute value");
    ids.push(id);
  }

  if (new Set(ids).size !== ids.length) {
    throw new ProductServiceError(
      "Attribute value tidak boleh berulang dalam satu variant",
    );
  }

  return ids.sort((a, b) => a - b);
};

const normalizeVariant = (data: CreateProductVariantBody): PreparedVariant => {
  validateObject(data, "Data variant");

  return {
    row: {
      sku: normalizeText(data.sku, "SKU", 100),
      cost_price: validateMoney(data.cost_price, "HPP"),
      selling_price: validateMoney(data.selling_price, "Harga jual"),
      barcode: normalizeNullableText(data.barcode, "Barcode", 100),
      is_default: validateBoolean(
        data.is_default === undefined ? false : data.is_default,
        "Status default",
      ),
      is_active: validateBoolean(
        data.is_active === undefined ? true : data.is_active,
        "Status aktif variant",
      ),
    },
    attributeValueIds: normalizeAttributeIds(data.attribute_value_ids),
  };
};

const combinationKey = (ids: number[]) => {
  return [...ids].sort((a, b) => a - b).join(",");
};

const ensureDefaultInvariant = (
  variants: {
    is_default: boolean | number;
    is_active: boolean | number;
  }[],
) => {
  if (variants.length === 0) {
    throw new ProductServiceError(
      "Produk harus memiliki minimal satu variant",
      409,
    );
  }

  const defaults = variants.filter((item) => Boolean(item.is_default));

  if (defaults.length !== 1 || !defaults.every((item) => item.is_active)) {
    throw new ProductServiceError(
      "Produk harus memiliki tepat satu variant default yang aktif. Pilih variant default pengganti terlebih dahulu.",
      409,
    );
  }
};

const rethrowDatabaseError = (error: unknown): never => {
  if (error instanceof ProductServiceError) {
    throw error;
  }

  const code = (error as { code?: string } | null)?.code;

  if (code === "ER_DUP_ENTRY") {
    throw new ProductServiceError(
      "Data duplikat. Pastikan SKU belum digunakan dan relasi atribut tidak berulang.",
      409,
    );
  }

  if (code === "ER_NO_REFERENCED_ROW_2") {
    throw new ProductServiceError(
      "Data referensi tidak tersedia atau sudah dihapus",
      409,
    );
  }

  if (code === "ER_ROW_IS_REFERENCED_2") {
    throw new ProductServiceError(
      "Data masih digunakan. Nonaktifkan produk atau variant sebagai gantinya.",
      409,
    );
  }

  throw error;
};

export const ProductService = (
  repository: ProductRepositoryType,
  categoryRepository: CategoryLookup,
  db: Knex,
) => {
  // Error ditangani setelah transaction selesai rollback.
  const withTransaction = async <T>(
    action: (trx: Knex.Transaction) => Promise<T>,
  ): Promise<T> => {
    try {
      return await db.transaction(action);
    } catch (error: unknown) {
      return rethrowDatabaseError(error);
    }
  };

  const ensureProductExists = async (
    id: number,
    trx: Knex.Transaction,
    lock = false,
  ) => {
    validateId(id, "ID produk");

    const product = lock
      ? await repository.getProductForUpdate(id, trx)
      : await repository.getProductById(id, trx);

    if (!product) {
      throw new ProductServiceError("Produk tidak ditemukan", 404);
    }

    return product;
  };

  const ensureCategoryExists = async (id: number, trx: Knex.Transaction) => {
    validateId(id, "ID kategori");

    const category = await categoryRepository.getCategoryById(id, trx);

    if (!category) {
      throw new ProductServiceError("Kategori tidak ditemukan", 404);
    }
  };

  const ensureVariantExists = async (
    productId: number,
    variantId: number,
    trx: Knex.Transaction,
  ): Promise<VariantRow> => {
    validateId(variantId, "ID variant");

    const variant = await repository.getVariantById(productId, variantId, trx);

    if (!variant) {
      throw new ProductServiceError(
        "Variant tidak ditemukan pada produk ini",
        404,
      );
    }

    return variant;
  };

  const validateAttributeValues = async (
    ids: number[],
    trx: Knex.Transaction,
  ) => {
    if (ids.length === 0) return;

    const values = await repository.getAttributeValuesByIds(ids, trx);

    if (values.length !== ids.length) {
      throw new ProductServiceError("Ada attribute value yang tidak ditemukan");
    }

    const attributeIds = values.map((item) => item.attribute_id);

    if (new Set(attributeIds).size !== attributeIds.length) {
      throw new ProductServiceError(
        "Satu variant hanya boleh memilih satu value dari setiap attribute",
      );
    }
  };

  const ensureSkuAvailable = async (
    sku: string,
    trx: Knex.Transaction,
    excludeVariantId?: number,
  ) => {
    const existing = await repository.getVariantBySku(sku, trx);

    if (existing && existing.id !== excludeVariantId) {
      throw new ProductServiceError(`SKU "${sku}" sudah digunakan`, 409);
    }
  };

  const ensureCombinationAvailable = async (
    productId: number,
    ids: number[],
    trx: Knex.Transaction,
    excludeVariantId?: number,
  ) => {
    const variants: VariantRow[] = await repository.getVariantsByProductId(
      productId,
      trx,
    );

    const links: VariantLink[] =
      await repository.getVariantAttributeValuesByProductId(productId, trx);

    const wanted = combinationKey(ids);

    for (const variant of variants) {
      if (variant.id === excludeVariantId) continue;

      const existingIds = links
        .filter((link) => link.variant_id === variant.id)
        .map((link) => link.attribute_value_id);

      if (combinationKey(existingIds) === wanted) {
        throw new ProductServiceError(
          "Kombinasi atribut sudah digunakan variant lain pada produk ini",
          409,
        );
      }
    }
  };

  const insertAttributeLinks = async (
    variantId: number,
    ids: number[],
    trx: Knex.Transaction,
  ) => {
    if (ids.length === 0) return;

    await repository.insertVariantAttributeValues(
      ids.map((attributeValueId) => ({
        variant_id: variantId,
        attribute_value_id: attributeValueId,
      })),
      trx,
    );
  };

  const readVariant = async (
    productId: number,
    variantId: number,
    trx: Knex.Transaction,
  ) => {
    const variant = await ensureVariantExists(productId, variantId, trx);

    const attributes: VariantLink[] =
      await repository.getAttributeValuesByVariantId(variantId, trx);

    return {
      ...variant,
      is_default: Boolean(variant.is_default),
      is_active: Boolean(variant.is_active),
      attributes,
    };
  };

  const readProduct = async (id: number, trx: Knex.Transaction) => {
    const product = await ensureProductExists(id, trx);

    const variants: VariantRow[] = await repository.getVariantsByProductId(
      id,
      trx,
    );

    const links: VariantLink[] =
      await repository.getVariantAttributeValuesByProductId(id, trx);

    const attributesByVariant = new Map<number, VariantLink[]>();

    for (const link of links) {
      const attributes = attributesByVariant.get(link.variant_id) ?? [];
      attributes.push(link);
      attributesByVariant.set(link.variant_id, attributes);
    }

    return {
      ...product,
      is_active: Boolean(product.is_active),
      variants: variants.map((variant) => ({
        ...variant,
        is_default: Boolean(variant.is_default),
        is_active: Boolean(variant.is_active),
        attributes: attributesByVariant.get(variant.id) ?? [],
      })),
    };
  };

  return {
    // PRODUCTS
    getAllProducts: async () => {
      return repository.getAllProducts();
    },

    getProductById: async (id: number) => {
      return withTransaction((trx) => readProduct(id, trx));
    },

    insertProduct: async (data: CreateProductBody) => {
      validateObject(data, "Data produk");

      if (!Array.isArray(data.variants) || data.variants.length === 0) {
        throw new ProductServiceError(
          "Produk harus memiliki minimal satu variant",
        );
      }

      const payload: InsertProduct = {
        category_id: data.category_id,
        name: normalizeText(data.name, "Nama produk", 150),
        image: normalizeNullableText(data.image, "Gambar produk", 255),
        description: normalizeDescription(data.description),
        is_active: validateBoolean(
          data.is_active === undefined ? true : data.is_active,
          "Status aktif produk",
        ),
      };

      const prepared = data.variants.map(normalizeVariant);
      const explicitDefaults = prepared.filter((item) => item.row.is_default);

      if (explicitDefaults.length > 1) {
        throw new ProductServiceError(
          "Hanya satu variant yang boleh menjadi default",
        );
      }

      // Kalau default tidak ditentukan, pilih variant aktif pertama.
      const defaultIndex =
        explicitDefaults.length === 1
          ? prepared.findIndex((item) => item.row.is_default)
          : prepared.findIndex((item) => item.row.is_active);

      for (const [index, item] of prepared.entries()) {
        item.row.is_default = index === defaultIndex;
      }

      ensureDefaultInvariant(prepared.map((item) => item.row));

      const combinations = new Set<string>();

      for (const item of prepared) {
        const key = combinationKey(item.attributeValueIds);

        if (combinations.has(key)) {
          throw new ProductServiceError(
            "Ada kombinasi atribut variant yang sama dalam request",
          );
        }

        combinations.add(key);
      }

      return withTransaction(async (trx) => {
        await ensureCategoryExists(payload.category_id, trx);

        const productId = await repository.insertProduct(payload, trx);

        for (const item of prepared) {
          await validateAttributeValues(item.attributeValueIds, trx);
          await ensureSkuAvailable(item.row.sku, trx);

          const variantId = await repository.insertVariant(
            {
              ...item.row,
              product_id: productId,
            },
            trx,
          );

          await insertAttributeLinks(variantId, item.attributeValueIds, trx);
        }

        return readProduct(productId, trx);
      });
    },

    updatedProduct: async (id: number, data: UpdateProduct) => {
      validateId(id, "ID produk");
      validateObject(data, "Data produk");

      const changes: UpdateProduct = {};

      if (data.category_id !== undefined) {
        validateId(data.category_id, "ID kategori");
        changes.category_id = data.category_id;
      }

      if (data.name !== undefined) {
        changes.name = normalizeText(data.name, "Nama produk", 150);
      }

      if (data.image !== undefined) {
        changes.image = normalizeNullableText(data.image, "Gambar produk", 255);
      }

      if (data.description !== undefined) {
        changes.description = normalizeDescription(data.description);
      }

      if (data.is_active !== undefined) {
        changes.is_active = validateBoolean(
          data.is_active,
          "Status aktif produk",
        );
      }

      if (Object.keys(changes).length === 0) {
        throw new ProductServiceError("Tidak ada data produk untuk diperbarui");
      }

      return withTransaction(async (trx) => {
        await ensureProductExists(id, trx, true);

        if (changes.category_id !== undefined) {
          await ensureCategoryExists(changes.category_id, trx);
        }

        await repository.updatedProduct(id, changes, trx);

        return readProduct(id, trx);
      });
    },

    deleteProduct: async (id: number) => {
      return withTransaction(async (trx) => {
        await ensureProductExists(id, trx, true);

        const variants: VariantRow[] = await repository.getVariantsByProductId(
          id,
          trx,
        );

        for (const variant of variants) {
          await repository.deleteAttributeValuesByVariantId(variant.id, trx);

          await repository.deleteVariant(id, variant.id, trx);
        }

        await repository.deleteProduct(id, trx);

        return { id, deleted: true };
      });
    },

    // PRODUCT VARIANTS
    getVariantsByProductId: async (productId: number) => {
      return withTransaction(async (trx) => {
        const product = await readProduct(productId, trx);
        return product.variants;
      });
    },

    getVariantById: async (productId: number, variantId: number) => {
      return withTransaction(async (trx) => {
        await ensureProductExists(productId, trx);
        return readVariant(productId, variantId, trx);
      });
    },

    insertVariant: async (
      productId: number,
      data: CreateProductVariantBody,
    ) => {
      const prepared = normalizeVariant(data);

      return withTransaction(async (trx) => {
        await ensureProductExists(productId, trx, true);

        await validateAttributeValues(prepared.attributeValueIds, trx);
        await ensureSkuAvailable(prepared.row.sku, trx);
        await ensureCombinationAvailable(
          productId,
          prepared.attributeValueIds,
          trx,
        );

        const existing: VariantRow[] = await repository.getVariantsByProductId(
          productId,
          trx,
        );

        // Mendukung produk lama yang belum memiliki variant.
        if (existing.length === 0) {
          prepared.row.is_default = true;
        }

        const nextState = existing.map((variant) => ({
          is_default: prepared.row.is_default
            ? false
            : Boolean(variant.is_default),
          is_active: Boolean(variant.is_active),
        }));

        ensureDefaultInvariant([...nextState, prepared.row]);

        if (prepared.row.is_default) {
          await repository.clearDefaultVariants(productId, trx);
        }

        const variantId = await repository.insertVariant(
          {
            ...prepared.row,
            product_id: productId,
          },
          trx,
        );

        await insertAttributeLinks(variantId, prepared.attributeValueIds, trx);

        return readVariant(productId, variantId, trx);
      });
    },

    updateVariant: async (
      productId: number,
      variantId: number,
      data: UpdateProductVariantBody,
    ) => {
      validateObject(data, "Data variant");
      validateId(variantId, "ID variant");

      const allowedFields: (keyof UpdateProductVariantBody)[] = [
        "sku",
        "cost_price",
        "selling_price",
        "barcode",
        "is_default",
        "is_active",
        "attribute_value_ids",
      ];

      if (!allowedFields.some((field) => data[field] !== undefined)) {
        throw new ProductServiceError(
          "Tidak ada data variant untuk diperbarui",
        );
      }

      return withTransaction(async (trx) => {
        await ensureProductExists(productId, trx, true);

        const current = await ensureVariantExists(productId, variantId, trx);

        const currentLinks: VariantLink[] =
          await repository.getAttributeValuesByVariantId(variantId, trx);

        // Bentuk keadaan akhir untuk divalidasi.
        const prepared = normalizeVariant({
          sku: data.sku === undefined ? current.sku : data.sku,
          cost_price:
            data.cost_price === undefined
              ? Number(current.cost_price)
              : data.cost_price,
          selling_price:
            data.selling_price === undefined
              ? Number(current.selling_price)
              : data.selling_price,
          barcode:
            data.barcode === undefined
              ? (current.barcode ?? null)
              : data.barcode,
          is_default:
            data.is_default === undefined
              ? Boolean(current.is_default)
              : data.is_default,
          is_active:
            data.is_active === undefined
              ? Boolean(current.is_active)
              : data.is_active,
          attribute_value_ids:
            data.attribute_value_ids === undefined
              ? currentLinks.map((link) => link.attribute_value_id)
              : data.attribute_value_ids,
        });

        await validateAttributeValues(prepared.attributeValueIds, trx);
        await ensureSkuAvailable(prepared.row.sku, trx, variantId);
        await ensureCombinationAvailable(
          productId,
          prepared.attributeValueIds,
          trx,
          variantId,
        );

        const variants: VariantRow[] = await repository.getVariantsByProductId(
          productId,
          trx,
        );

        const nextState = variants.map((variant) => {
          if (variant.id === variantId) {
            return prepared.row;
          }

          return {
            is_default: prepared.row.is_default
              ? false
              : Boolean(variant.is_default),
            is_active: Boolean(variant.is_active),
          };
        });

        ensureDefaultInvariant(nextState);

        if (prepared.row.is_default) {
          await repository.clearDefaultVariants(productId, trx);
        }

        await repository.updateVariant(productId, variantId, prepared.row, trx);

        // undefined: biarkan relasi lama.
        // []: hapus seluruh relasi atribut variant ini.
        if (data.attribute_value_ids !== undefined) {
          await repository.deleteAttributeValuesByVariantId(variantId, trx);

          await insertAttributeLinks(
            variantId,
            prepared.attributeValueIds,
            trx,
          );
        }

        return readVariant(productId, variantId, trx);
      });
    },

    deleteVariant: async (productId: number, variantId: number) => {
      return withTransaction(async (trx) => {
        await ensureProductExists(productId, trx, true);
        await ensureVariantExists(productId, variantId, trx);

        const variants: VariantRow[] = await repository.getVariantsByProductId(
          productId,
          trx,
        );

        const remaining = variants.filter(
          (variant) => variant.id !== variantId,
        );

        ensureDefaultInvariant(remaining);

        await repository.deleteAttributeValuesByVariantId(variantId, trx);

        await repository.deleteVariant(productId, variantId, trx);

        return { id: variantId, product_id: productId, deleted: true };
      });
    },
  };
};

export type ProductServiceType = ReturnType<typeof ProductService>;
