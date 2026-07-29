/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("promotion_rules", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("promotion_id").unsigned().notNullable();

    // Business
    table.string("rule_type", 30).notNullable();

    table.bigInteger("reference_id").unsigned().nullable();

    table.string("operator", 30).notNullable();

    table.string("value", 255).notNullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    // Foreign Keys
    table
      .foreign("promotion_id", "fk_promotion_rules_promotion")
      .references("id")
      .inTable("promotions")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // Index
    table.index(["promotion_id"]);
    table.index(["rule_type"]);
    table.index(["reference_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("promotion_rules");
}
