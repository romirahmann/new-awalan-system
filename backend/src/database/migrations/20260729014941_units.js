/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("units", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.string("symbol", 20).notNullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table.unique(["name"]);
    table.unique(["symbol"]);

    // Index
    table.index(["name"]);
    table.index(["symbol"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("units");
}
