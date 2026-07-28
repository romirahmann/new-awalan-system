/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("product_modifier_groups", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("product_id").unsigned().notNullable();

    table.bigInteger("modifier_group_id").unsigned().notNullable();

    // Override Rules
    table.smallint("min_select_override").unsigned().nullable();

    table.smallint("max_select_override").unsigned().nullable();

    table.boolean("is_required_override").nullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("product_id", "fk_product_modifier_groups_product")
      .references("id")
      .inTable("products")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("modifier_group_id", "fk_product_modifier_groups_modifier_group")
      .references("id")
      .inTable("modifier_groups")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.unique(["product_id", "modifier_group_id"]);

    // Index
    table.index(["product_id"]);
    table.index(["modifier_group_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("product_modifier_groups");
}
