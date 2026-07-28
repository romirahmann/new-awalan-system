/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("modifier_options", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("modifier_group_id").unsigned().notNullable();

    // Business
    table.string("name", 100).notNullable();

    table.decimal("extra_price", 15, 2).notNullable().defaultTo(0);

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("modifier_group_id", "fk_modifier_options_group")
      .references("id")
      .inTable("modifier_groups")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.unique(["modifier_group_id", "name"]);

    // Index
    table.index(["modifier_group_id"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("modifier_options");
}
