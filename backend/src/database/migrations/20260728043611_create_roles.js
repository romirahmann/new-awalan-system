/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("roles", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable().unique();
    table.string("description", 255).nullable();

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("roles");
}
