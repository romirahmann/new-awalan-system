/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("invoice_counters", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.date("date_now").notNullable();

    table.integer("counter").unsigned().notNullable().defaultTo(0);

    // Constraints
    table.unique(["date_now"]);

    // Index
    table.index(["date_now"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("invoice_counters");
}
