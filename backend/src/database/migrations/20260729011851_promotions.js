/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("promotions", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Business
    table.string("name", 150).notNullable();

    table.string("type", 30).notNullable();

    table.string("discount_type", 20).notNullable();

    table.decimal("discount_value", 15, 2).notNullable();

    table.timestamp("start_date").notNullable();

    table.timestamp("end_date").nullable();

    table.integer("priority").unsigned().notNullable().defaultTo(0);

    table.boolean("is_stackable").notNullable().defaultTo(false);

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);
    table.boolean("auto_apply").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table.unique(["name"]);

    // Index
    table.index(["type"]);
    table.index(["is_active"]);
    table.index(["start_date"]);
    table.index(["end_date"]);
    table.index(["priority"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("promotions");
}
