/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("order_items", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("order_id").unsigned().notNullable();

    table.bigInteger("product_variant_id").unsigned().notNullable();

    // Business
    table.integer("qty").unsigned().notNullable();

    table.decimal("unit_price", 15, 2).notNullable();

    table.decimal("sub_total", 15, 2).notNullable();

    table.boolean("status_served").notNullable().defaultTo(false);

    table.timestamp("served_at").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("order_id", "fk_order_items_order")
      .references("id")
      .inTable("orders")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("product_variant_id", "fk_order_items_variant")
      .references("id")
      .inTable("product_variants")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["order_id"]);
    table.index(["product_variant_id"]);
    table.index(["status_served"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("order_items");
}
