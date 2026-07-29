/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("raw_material_categories", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.string("description", 255).nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

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
  await knex.schema.dropTableIfExists("raw_material_categories");
}
