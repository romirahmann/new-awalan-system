/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("order_item_modifiers", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("order_item_id").unsigned().notNullable();

    table.bigInteger("modifier_option_id").unsigned().notNullable();

    // Business
    table.integer("qty").unsigned().notNullable().defaultTo(1);

    table.decimal("extra_price", 15, 2).notNullable().defaultTo(0);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("order_item_id", "fk_order_item_modifiers_order_item")
      .references("id")
      .inTable("order_items")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("modifier_option_id", "fk_order_item_modifiers_modifier_option")
      .references("id")
      .inTable("modifier_options")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["order_item_id"]);
    table.index(["modifier_option_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("order_item_modifiers");
}
