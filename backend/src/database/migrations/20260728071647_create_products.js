/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("products", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("category_id").unsigned().notNullable();

    // Business
    table.string("name", 150).notNullable();

    table.string("image", 255).nullable();

    table.text("description").nullable();

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("category_id", "fk_products_category")
      .references("id")
      .inTable("categories")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["category_id"]);
    table.index(["name"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("products");
}
