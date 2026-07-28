/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("product_variants", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("product_id").unsigned().notNullable();

    // Business
    table.string("sku", 100).notNullable();

    table.decimal("cost_price", 15, 2).notNullable().defaultTo(0);

    table.decimal("selling_price", 15, 2).notNullable();

    table.boolean("is_default").notNullable().defaultTo(false);

    table.boolean("is_active").notNullable().defaultTo(true);

    table.string("barcode", 100).nullable();
    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("product_id", "fk_product_variants_product")
      .references("id")
      .inTable("products")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.unique(["sku"]);

    // Index
    table.index(["product_id"]);
    table.index(["is_active"]);
    table.index(["is_default"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("product_variants");
}
