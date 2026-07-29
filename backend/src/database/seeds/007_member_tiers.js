/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("membership_tiers").del();

  await knex("membership_tiers").insert([
    {
      name: "Teman Awal",
      min_points_required: 0,
      benefits_description: null,
      sort_order: 1,
    },
    {
      name: "Sahabat Awal",
      min_points_required: 1000,
      benefits_description: null,
      sort_order: 2,
    },
    {
      name: "Saudara Awal",
      min_points_required: 2000,
      benefits_description: null,
      sort_order: 3,
    },
  ]);
}
