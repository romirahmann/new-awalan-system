/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("orders", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("customer_id").unsigned().nullable();

    table.bigInteger("cashier_id").unsigned().notNullable();

    table.bigInteger("store_id").unsigned().notNullable();

    // Business
    table.string("type", 20).notNullable();

    table.string("status", 20).notNullable();

    table.text("notes").nullable();

    table.string("table_no", 20).nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("customer_id", "fk_orders_customer")
      .references("id")
      .inTable("customers")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("cashier_id", "fk_orders_cashier")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("store_id", "fk_orders_store")
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["customer_id"]);
    table.index(["cashier_id"]);
    table.index(["store_id"]);
    table.index(["status"]);
    table.index(["type"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("orders");
}
