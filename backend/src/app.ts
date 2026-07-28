import Fastify from "fastify";
import { db } from "./database/knex.js";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  try {
    await db.raw("SELECT 1");

    return {
      success: true,
      message: "Application is healthy",
      database: "Connected",
    };
  } catch (error) {
    return {
      success: false,
      message: "Database connection failed",
      error,
    };
  }
});

export default app;
