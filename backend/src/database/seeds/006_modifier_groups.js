/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("modifier_groups").del();

  await knex("modifier_groups").insert([
    {
      name: "Extra Shot",
      min_select: 0,
      max_select: 1,
      is_required: false,
      sort_order: 1,
    },
  ]);
}
