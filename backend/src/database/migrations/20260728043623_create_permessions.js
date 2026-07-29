/**
 * @param { import("knex").Knex } knex
 
 */
export async function up(knex) {
  await knex.schema.createTable("permissions", (table) => {
    table.bigIncrements("id");
    table.string("code", 100).notNullable();
    table.string("module", 50).notNullable();
    table.string("description", 255).nullable();
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("permissions");
}
