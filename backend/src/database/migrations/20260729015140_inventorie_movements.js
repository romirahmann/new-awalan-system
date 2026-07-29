/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("inventory_movements", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Key
    table.bigInteger("inventory_id").unsigned().notNullable();

    // Business
    table.string("type", 30).notNullable();

    table.string("reference_type", 30).notNullable();

    table.string("invoice_code", 100).nullable();

    table.decimal("qty", 15, 3).notNullable();

    table.decimal("before_stock", 15, 3).notNullable();

    table.decimal("after_stock", 15, 3).notNullable();

    table.text("notes").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.bigInteger("created_by").unsigned().nullable();

    // Foreign Key
    table
      .foreign("inventory_id", "fk_inventory_movements_inventory")
      .references("id")
      .inTable("inventories")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_inventory_movements_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    // Index
    table.index(["inventory_id"]);
    table.index(["type"]);
    table.index(["reference_type"]);
    table.index(["created_at"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("inventory_movements");
}
