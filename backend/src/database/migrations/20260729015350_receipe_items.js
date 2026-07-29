/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("recipe_items", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("recipe_id").unsigned().notNullable();

    table.bigInteger("raw_material_id").unsigned().notNullable();

    table.string("raw_material_name", 150).notNullable();

    table.bigInteger("unit_id").unsigned().notNullable();

    // Business
    table.decimal("qty", 15, 3).notNullable();

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    table.bigInteger("updated_by").unsigned().nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Foreign Keys
    table
      .foreign("recipe_id", "fk_recipe_items_recipe")
      .references("id")
      .inTable("recipes")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("raw_material_id", "fk_recipe_items_raw_material")
      .references("id")
      .inTable("raw_materials")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("unit_id", "fk_recipe_items_unit")
      .references("id")
      .inTable("units")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_recipe_items_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("updated_by", "fk_recipe_items_updated_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("deleted_by", "fk_recipe_items_deleted_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    // Constraints
    table.unique(["recipe_id", "raw_material_id"]);

    // Index
    table.index(["recipe_id"]);
    table.index(["raw_material_id"]);
    table.index(["unit_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("recipe_items");
}
