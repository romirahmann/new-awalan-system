/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("attribute_values", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("attribute_id").unsigned().notNullable();

    // Business
    table.string("value", 100).notNullable();

    table.smallInteger("sort_order").unsigned().notNullable().defaultTo(0);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("attribute_id", "fk_attribute_values_attribute")
      .references("id")
      .inTable("attributes")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.unique(["attribute_id", "value"]);

    // Index
    table.index(["attribute_id"]);
    table.index(["sort_order"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("attribute_values");
}
