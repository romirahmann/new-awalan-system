/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("customers", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 150).notNullable();

    table.string("phone", 20).notNullable();

    table.date("birthday").nullable();

    table.date("join_date").notNullable();

    // Status
    table.boolean("is_member").notNullable().defaultTo(false);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Constraints
    table.unique(["phone"]);

    // Index
    table.index(["name"]);
    table.index(["phone"]);
    table.index(["is_member"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("customers");
}
