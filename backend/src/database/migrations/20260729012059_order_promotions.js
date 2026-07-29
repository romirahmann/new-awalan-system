/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("order_promotions", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("order_id").unsigned().notNullable();

    table.bigInteger("promotion_id").unsigned().notNullable();

    // Business
    table.decimal("discount_amount", 15, 2).notNullable().defaultTo(0);

    table.decimal("cashback_amount", 15, 2).notNullable().defaultTo(0);

    table.integer("point_bonus").unsigned().notNullable().defaultTo(0);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    table.unique(["order_id", "promotion_id"]);

    // Foreign Keys
    table
      .foreign("order_id", "fk_order_promotions_order")
      .references("id")
      .inTable("orders")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .foreign("promotion_id", "fk_order_promotions_promotion")
      .references("id")
      .inTable("promotions")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Index
    table.index(["order_id"]);
    table.index(["promotion_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("order_promotions");
}
