/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("inventories", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("store_id").unsigned().notNullable();

    table.bigInteger("raw_material_id").unsigned().notNullable();

    // Business
    table.decimal("current_stock", 15, 3).notNullable().defaultTo(0);

    table.decimal("min_stock", 15, 3).notNullable().defaultTo(0);

    table.decimal("avg_cost", 15, 2).notNullable().defaultTo(0);

    table.timestamp("last_stock_opname_at").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("store_id", "fk_inventories_store")
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("raw_material_id", "fk_inventories_raw_material")
      .references("id")
      .inTable("raw_materials")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Constraints
    table.unique(["store_id", "raw_material_id"]);

    // Index
    table.index(["store_id"]);
    table.index(["raw_material_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("inventories");
}
