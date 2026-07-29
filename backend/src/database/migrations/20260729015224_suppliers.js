/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("suppliers", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 150).notNullable();

    table.string("phone", 30).nullable();

    table.string("email", 150).nullable();

    table.text("address").nullable();

    table.string("contact_person", 100).nullable();

    table.text("notes").nullable();

    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table.unique(["name"]);

    // Index
    table.index(["name"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("suppliers");
}
