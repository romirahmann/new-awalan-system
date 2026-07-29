/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("raw_material_categories").del();

  await knex("raw_material_categories").insert([
    {
      name: "Coffee Bean",
      description: "Coffee beans used for espresso and manual brew preparation",
    },
    {
      name: "Milk & Dairy",
      description: "Milk and dairy products used for beverage preparation",
    },
    {
      name: "Sweetener",
      description: "Sugar, syrup, and other sweetener ingredients",
    },
    {
      name: "Powder & Tea",
      description:
        "Powder and tea ingredients such as matcha, chocolate, and other beverages",
    },
    {
      name: "Flavoring",
      description: "Flavor syrup and additional beverage ingredients",
    },
    {
      name: "Food Ingredient",
      description: "Ingredients used for food, snack, and dessert preparation",
    },
    {
      name: "Packaging",
      description: "Cup, bottle, lid, straw, and other packaging materials",
    },
    {
      name: "Operational Supplies",
      description: "Supporting supplies used for daily cafe operations",
    },
  ]);
}
