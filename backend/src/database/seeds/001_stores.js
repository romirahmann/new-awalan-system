/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("stores").del();

  await knex("stores").insert([
    {
      name: "Awalan Coffee",

      address: "Jl. Pangkalan-Loji, Desa Jatilaksana",

      province: "Jawa Barat",

      city: "Bandung",

      timezone: "Asia/Jakarta",

      opened_at: "",

      is_active: true,

      created_at: knex.fn.now(),
    },
  ]);
}
