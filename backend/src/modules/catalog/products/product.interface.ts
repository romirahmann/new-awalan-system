// DATA TABEL PRODUCTS
export interface InsertProduct {
  category_id: number;
  name: string;
  image?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export type UpdateProduct = Partial<InsertProduct>;

// DATA TABEL PRODUCT_VARIANTS
export interface InsertProductVariant {
  product_id: number;
  sku: string;
  cost_price: number;
  selling_price: number;
  is_default: boolean;
  is_active: boolean;
  barcode?: string | null;
}

export type UpdateProductVariant = Partial<
  Omit<InsertProductVariant, "product_id">
>;

// DATA TABEL VARIANT_ATTRIBUTE_VALUES
export interface InsertVariantAttributeValue {
  variant_id: number;
  attribute_value_id: number;
}

// INPUT VARIANT DARI REQUEST
// product_id diambil dari produk baru atau parameter route.
export interface CreateVariantInput {
  sku: string;
  cost_price: number;
  selling_price: number;
  is_default?: boolean;
  is_active?: boolean;
  barcode?: string | null;
  attribute_value_ids: number[];
}

// BODY CREATE PRODUCT BESERTA VARIANTS
export interface CreateProductBody extends InsertProduct {
  variants: CreateVariantInput[];
}

// BODY UPDATE DATA PRODUK INDUK
export type UpdateProductBody = UpdateProduct;

// BODY TAMBAH VARIANT KE PRODUK YANG SUDAH ADA
export type CreateProductVariantBody = CreateVariantInput;

// BODY UPDATE VARIANT
export type UpdateProductVariantBody = Partial<CreateVariantInput>;
