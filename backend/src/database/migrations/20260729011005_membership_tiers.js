/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("membership_tiers", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 100).notNullable();

    table.integer("min_points_required").unsigned().notNullable().defaultTo(0);

    table.text("benefits_description").nullable();

    table.integer("sort_order").unsigned().notNullable().defaultTo(0);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table.unique(["name"]);

    // Index
    table.index(["sort_order"]);
    table.index(["min_points_required"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("membership_tiers");
}
