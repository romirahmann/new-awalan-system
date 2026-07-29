/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("purchase_orders", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.string("po_number", 50).notNullable();

    table.bigInteger("supplier_id").unsigned().notNullable();

    table.bigInteger("store_id").unsigned().notNullable();

    table.bigInteger("created_by").unsigned().nullable();

    // Business

    table.string("status", 20).notNullable();

    table.date("order_date").notNullable();

    table.date("received_date").nullable();

    table.text("notes").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("updated_by").unsigned().nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Foreign Keys
    table
      .foreign("supplier_id", "fk_purchase_orders_supplier")
      .references("id")
      .inTable("suppliers")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("store_id", "fk_purchase_orders_store")
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_purchase_orders_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("updated_by", "fk_purchase_orders_updated_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("deleted_by", "fk_purchase_orders_deleted_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table.unique(["po_number"]);

    // Index
    table.index(["po_number"]);
    table.index(["supplier_id"]);
    table.index(["store_id"]);
    table.index(["status"]);
    table.index(["order_date"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("purchase_orders");
}
