/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.createTable("customer_members", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("customer_id").unsigned().notNullable();

    table.bigInteger("member_tier_id").unsigned().notNullable();

    // Business
    table.text("benefits_description").nullable();

    table.decimal("total_spending", 15, 2).notNullable().defaultTo(0);

    table.integer("total_visit").unsigned().notNullable().defaultTo(0);

    table.timestamp("last_visit_at").nullable();

    table.integer("points").notNullable().defaultTo(0);

    table.decimal("cashback", 15, 2).notNullable().defaultTo(0);

    // Audit
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").nullable();

    // Foreign Keys
    table
      .foreign("customer_id", "fk_customer_members_customer")
      .references("id")
      .inTable("customers")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("member_tier_id", "fk_customer_members_tier")
      .references("id")
      .inTable("membership_tiers")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Constraints
    table.unique(["customer_id"]);

    // Index
    table.index(["member_tier_id"]);
    table.index(["points"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("customer_members");
}
