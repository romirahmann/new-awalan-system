/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("invoices", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Key
    table.bigInteger("order_id").unsigned().notNullable();

    // Business
    table.string("invoice_code", 50).notNullable();

    table.decimal("sub_total", 15, 2).notNullable();

    table.decimal("tax_amount", 15, 2).notNullable().defaultTo(0);

    table.decimal("total_amount", 15, 2).notNullable();

    table.string("status", 20).notNullable();

    table.text("notes").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Key
    table
      .foreign("order_id", "fk_invoices_order")
      .references("id")
      .inTable("orders")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Constraints
    table.unique(["invoice_code"]);
    table.unique(["order_id"]);

    // Index
    table.index(["invoice_code"]);
    table.index(["status"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("invoices");
}
