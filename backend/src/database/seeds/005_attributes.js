/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("attributes").del();

  await knex("attributes").insert([
    {
      name: "Temperature",
      description: "Serving temperature preference such as Hot or Iced",
    },
    {
      name: "Sugar Level",
      description: "Sugar level preference for beverages",
    },

    {
      name: "Ice Level",
      description: "Ice amount preference for beverages",
    },
  ]);
}
