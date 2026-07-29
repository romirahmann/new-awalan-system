/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("categories").del();

  await knex("categories").insert([
    {
      name: "Coffee",
      description: "Espresso based coffee beverages",
      type: "DRINK",
    },

    {
      name: "Matcha",
      description: "Matcha based beverages",
      type: "DRINK",
    },

    {
      name: "Non Coffee",
      description: "Non coffee beverages such as chocolate and tea",
      type: "DRINK",
    },

    {
      name: "Manual Brew",
      description: "Manual brewing coffee beverages",
      type: "DRINK",
    },

    {
      name: "Bottle",
      description: "Ready to drink bottled beverages",
      type: "DRINK",
    },

    // =====================
    // FOOD
    // =====================

    {
      name: "Food",
      description: "Main food menu",
      type: "FOOD",
    },

    {
      name: "Snack",
      description: "Light snacks and side dishes",
      type: "FOOD",
    },

    {
      name: "Dessert",
      description: "Sweet dishes and desserts",
      type: "FOOD",
    },
  ]);
}
