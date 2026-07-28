/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("variant_attribute_values", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("variant_id").unsigned().notNullable();

    table.bigInteger("attribute_value_id").unsigned().notNullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("variant_id", "fk_variant_attribute_values_variant")
      .references("id")
      .inTable("product_variants")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign(
        "attribute_value_id",
        "fk_variant_attribute_values_attribute_value",
      )
      .references("id")
      .inTable("attribute_values")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.unique(["variant_id", "attribute_value_id"]);

    // Index
    table.index(["variant_id"]);
    table.index(["attribute_value_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("variant_attribute_values");
}
