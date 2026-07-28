import "dotenv/config";

/** @type {import('knex').Knex.Config} */
const config = {
  client: "mysql2",

  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  migrations: {
    directory: "./src/database/migrations",
    extension: "js",
    tableName: "knex_migrations",
  },

  seeds: {
    directory: "./src/database/seeds",
    extension: "js",
  },

  pool: {
    min: 2,
    max: 10,
  },
};

export default config;
