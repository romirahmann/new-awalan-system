/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("purchase_order_items", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("purchase_order_id").unsigned().notNullable();

    table.bigInteger("raw_material_id").unsigned().notNullable();

    // Snapshot
    table.string("raw_material_name", 150).notNullable();

    // Business
    table.decimal("qty", 15, 3).notNullable();

    table.decimal("unit_cost", 15, 2).notNullable();

    table.decimal("subtotal", 15, 2).notNullable();

    // Audit

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("purchase_order_id", "fk_po_items_purchase_order")
      .references("id")
      .inTable("purchase_orders")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("raw_material_id", "fk_po_items_raw_material")
      .references("id")
      .inTable("raw_materials")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["purchase_order_id"]);
    table.index(["raw_material_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("purchase_order_items");
}
