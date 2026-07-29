/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("roles").del();

  await knex("roles").insert([
    {
      name: "Owner",
      description: "Full access to all system features",
      is_active: true,
    },

    {
      name: "Manager",
      description: "Manage operational activities and reports",
      is_active: true,
    },

    {
      name: "Cashier",
      description: "Handle sales transactions and payments",
      is_active: true,
    },

    {
      name: "Inventory Staff",
      description: "Manage inventory, stock adjustment, and materials",
      is_active: true,
    },

    {
      name: "Barista",
      description: "Prepare beverage orders",
      is_active: true,
    },

    {
      name: "Kitchen",
      description: "Prepare foods orders",
      is_active: true,
    },
  ]);
}
