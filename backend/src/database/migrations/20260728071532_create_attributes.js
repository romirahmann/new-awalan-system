/**
 * @param {import("knex").Knex} knex
 
 */
export async function up(knex) {
  await knex.schema.createTable("attributes", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.string("description", 255).nullable();

    // Constraints
    table.unique(["name"]);

    // Index
    table.index(["name"]);
  });
}

/**
 * @param {import("knex").Knex} knex

 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("attributes");
}
