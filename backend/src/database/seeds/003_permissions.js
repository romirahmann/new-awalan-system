/**
 * @param { import("knex").Knex } knex
 * @returns { Promise }
 */
export async function seed(knex) {
  await knex("permissions").del();

  await knex("permissions").insert([
    {
      module: "dashboard",
      code: "dashboard.view",
      description: "View dashboard and business summary",
    },

    {
      module: "product",
      code: "product.view",
      description: "View product data",
    },
    {
      module: "product",
      code: "product.create",
      description: "Create new product",
    },
    {
      module: "product",
      code: "product.update",
      description: "Update existing product",
    },
    {
      module: "product",
      code: "product.delete",
      description: "Delete product",
    },

    {
      module: "category",
      code: "category.view",
      description: "View product categories",
    },
    {
      module: "category",
      code: "category.manage",
      description: "Create, update, and delete categories",
    },

    {
      module: "order",
      code: "order.create",
      description: "Create customer order",
    },
    {
      module: "order",
      code: "order.view",
      description: "View order transactions",
    },
    {
      module: "order",
      code: "order.cancel",
      description: "Cancel customer order",
    },

    {
      module: "inventory",
      code: "inventory.view",
      description: "View stock inventory",
    },
    {
      module: "inventory",
      code: "inventory.adjust",
      description: "Adjust inventory stock",
    },

    {
      module: "material",
      code: "material.view",
      description: "View raw materials",
    },
    {
      module: "material",
      code: "material.manage",
      description: "Create, update, and delete raw materials",
    },

    {
      module: "purchase",
      code: "purchase.create",
      description: "Create purchase order",
    },
    {
      module: "purchase",
      code: "purchase.approve",
      description: "Approve purchase order",
    },
    {
      module: "purchase",
      code: "purchase.view",
      description: "View purchase order",
    },

    {
      module: "recipe",
      code: "recipe.view",
      description: "View product recipes",
    },
    {
      module: "recipe",
      code: "recipe.manage",
      description: "Create and update product recipes",
    },

    {
      module: "report",
      code: "report.view",
      description: "View business reports",
    },

    {
      module: "user",
      code: "user.view",
      description: "View user accounts",
    },
    {
      module: "user",
      code: "user.manage",
      description: "Create, update, and delete users",
    },

    {
      module: "role",
      code: "role.manage",
      description: "Manage roles and permissions",
    },
  ]);
}
