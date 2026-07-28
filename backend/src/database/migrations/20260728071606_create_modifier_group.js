/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("modifier_groups", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.smallint("min_select").unsigned().notNullable().defaultTo(0);

    table.smallint("max_select").unsigned().notNullable().defaultTo(1);

    table.boolean("is_required").notNullable().defaultTo(false);

    table.integer("sort_order").unsigned().notNullable().defaultTo(0);
    // Constraints
    table.unique(["name"]);

    // Index
    table.index(["name"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("modifier_groups");
}
