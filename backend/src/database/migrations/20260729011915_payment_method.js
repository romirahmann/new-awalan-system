/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("payment_methods", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("code", 50).notNullable();

    table.string("description", 255).nullable();

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table.unique(["code"]);

    // Index
    table.index(["code"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("payment_methods");
}
