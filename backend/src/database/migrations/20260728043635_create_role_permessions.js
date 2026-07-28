/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("role_permissions", (table) => {
    // Primary Key
    table.bigIncrements("id");

    // Foreign Keys
    table.bigInteger("role_id").unsigned().notNullable();
    table.bigInteger("permission_id").unsigned().notNullable();

    // Constraints
    table
      .foreign("role_id", "fk_role_permissions_role")
      .references("id")
      .inTable("roles")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .foreign("permission_id", "fk_role_permissions_permission")
      .references("id")
      .inTable("permissions")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    // Prevent duplicate role-permission pairs
    table.unique(["role_id", "permission_id"]);

    // Index
    table.index(["role_id"]);
    table.index(["permission_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("role_permissions");
}
