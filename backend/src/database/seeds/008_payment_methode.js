/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("payment_methods").del();

  await knex("payment_methods").insert([
    {
      code: "CASH",
      description: "Payment using cash",
      is_active: true,
    },
    {
      code: "QRIS",
      description: "Payment using QRIS",
      is_active: true,
    },
    {
      code: "TRANSFER",
      description: "Payment using bank transfer",
      is_active: true,
    },
  ]);
}
