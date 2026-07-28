/**
 * @param { import("knex").Knex } knex

 */
export async function up(knex) {
  await knex.schema.createTable("role_permissions", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("store_id").unsigned().notNullable();
    table.bigInteger("role_id").unsigned().notNullable();

    // Business
    table.string("username", 50).notNullable();

    table.string("full_name", 150).notNullable();

    table.string("email", 150).notNullable();

    table.string("password", 255).notNullable();

    table.timestamp("last_login_at").nullable();

    // Status
    table.boolean("is_active").notNullable().defaultTo(true);

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now);
    table.timestamp("updated_at").nullable();

    // Constraints
    table
      .foreign("store_id", "fk_users_store")
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("role_id", "fk_users_role")
      .references("id")
      .inTable("roles")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Unique
    table.unique(["username"]);
    table.unique(["email"]);

    // Index
    table.index(["store_id"]);
    table.index(["role_id"]);
    table.index(["is_active"]);
  });
}

/**
 * @param { import("knex").Knex } knex

 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("role_permissions");
}
