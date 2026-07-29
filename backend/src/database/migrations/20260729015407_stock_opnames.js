/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("stock_opnames", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("store_id").unsigned().notNullable();

    table.bigInteger("performed_by").unsigned().notNullable();

    // Business
    table.date("opname_date").notNullable();

    table.text("notes").nullable();

    table.string("status", 20).notNullable().defaultTo("DRAFT");

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    table.timestamp("deleted_at").nullable();

    table.bigInteger("created_by").unsigned().nullable();

    table.bigInteger("updated_by").unsigned().nullable();

    table.bigInteger("deleted_by").unsigned().nullable();

    // Foreign Keys
    table
      .foreign("store_id", "fk_stock_opnames_store")
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("performed_by", "fk_stock_opnames_performed_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("created_by", "fk_stock_opnames_created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("updated_by", "fk_stock_opnames_updated_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table
      .foreign("deleted_by", "fk_stock_opnames_deleted_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    // Index
    table.index(["store_id"]);
    table.index(["performed_by"]);
    table.index(["opname_date"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("stock_opnames");
}
