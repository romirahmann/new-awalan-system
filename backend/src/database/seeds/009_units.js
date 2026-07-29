/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("units").del();

  await knex("units").insert([
    {
      name: "Gram",
      symbol: "g",
    },
    {
      name: "Kilogram",
      symbol: "kg",
    },
    {
      name: "Liter",
      symbol: "ltr",
    },
    {
      name: "Milliliter",
      symbol: "ml",
    },
    {
      name: "Piece",
      symbol: "pcs",
    },
    {
      name: "Bottle",
      symbol: "btl",
    },
    {
      name: "Pack",
      symbol: "pack",
    },
  ]);
}
