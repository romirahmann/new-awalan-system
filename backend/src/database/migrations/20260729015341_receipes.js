/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("recipes", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("product_variant_id").unsigned().notNullable();

    // Business
    table.integer("version").unsigned().notNullable().defaultTo(1);

    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    table.bigInteger("updated_by").unsigned().nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Foreign Key
    table
      .foreign("product_variant_id", "fk_recipes_variant")
      .references("id")
      .inTable("product_variants")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_recipes_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("updated_by", "fk_recipes_updated_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("deleted_by", "fk_recipes_deleted_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    // Constraints
    table.unique(["product_variant_id", "version"]);

    // Index
    table.index(["product_variant_id"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("recipes");
}
