/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("raw_materials", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("unit_id").unsigned().notNullable();

    table.bigInteger("category_id").unsigned().notNullable();

    // Business
    table.string("code", 50).notNullable();

    table.string("name", 150).notNullable();

    table.decimal("cost_price", 15, 2).notNullable().defaultTo(0);

    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("unit_id", "fk_raw_materials_unit")
      .references("id")
      .inTable("units")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("category_id", "fk_raw_materials_category")
      .references("id")
      .inTable("raw_material_categories")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Constraints
    table.unique(["code"]);
    table.unique(["name"]);

    // Index
    table.index(["category_id"]);
    table.index(["unit_id"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("raw_materials");
}
