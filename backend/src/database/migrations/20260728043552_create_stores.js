import { addTimestamp } from "../../shared/database/migration.helper.js";

/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("stores", (table) => {
    table.bigIncrements("id");

    // Business Information
    table.string("name", 150).notNullable();

    table.text("address").nullable();

    table.string("province", 100).nullable();

    table.string("city", 100).nullable();

    table.string("timezone", 50).notNullable().defaultTo("Asia/Jakarta");

    table.time("opened_at").nullable();

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now);
    table.timestamp("updated_at").nullable();

    // Index
    table.index(["name"]);
    table.index(["city"]);
    table.index(["is_active"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("stores");
}
