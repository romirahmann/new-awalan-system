/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("categories", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.string("description", 255).nullable();

    table.string("type", 20).notNullable();

    // Constraints
    table.unique(["name", "type"]);

    // Index
    table.index(["type"]);
    table.index(["name"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("categories");
}
