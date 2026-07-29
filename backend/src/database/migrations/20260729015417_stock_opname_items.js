/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("stock_opname_items", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("stock_opname_id").unsigned().notNullable();

    table.bigInteger("inventory_id").unsigned().notNullable();

    // Business
    table.decimal("system_qty", 15, 3).notNullable();

    table.decimal("actual_qty", 15, 3).notNullable();

    table.decimal("difference", 15, 3).notNullable();

    table.text("notes").nullable();

    table.string("raw_material_name", 150).notNullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    table.bigInteger("updated_by").unsigned().nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Foreign Keys
    table
      .foreign("stock_opname_id", "fk_stock_opname_items_opname")
      .references("id")
      .inTable("stock_opnames")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("inventory_id", "fk_stock_opname_items_inventory")
      .references("id")
      .inTable("inventories")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_stock_opname_items_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("updated_by", "fk_stock_opname_items_updated_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("deleted_by", "fk_stock_opname_items_deleted_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    // Constraints
    table.unique(["stock_opname_id", "inventory_id"]);

    // Index
    table.index(["stock_opname_id"]);
    table.index(["inventory_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("stock_opname_items");
}
