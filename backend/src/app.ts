import Fastify from "fastify";
import { db } from "./database/knex.js";
import routes from "./routes/index.js";
import errorHandler from "./plugins/error-handler.js";
import fastifyCors from "@fastify/cors";
import helmetPlugin from "./plugins/helmet.js";
import databasePlugin from "./plugins/database.js";
import jwtPlugin from "./plugins/jwt.js";

const app = Fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(helmetPlugin);
app.register(databasePlugin);
app.register(jwtPlugin);

app.register(routes);

app.register(errorHandler);

// UJI COBA SERVER
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

app.get("/error", async () => {
  throw new Error("Ini Error");
});

app.get("/token", async () => {
  const token = await app.jwt.sign({
    id: 1,
    email: "admin@awalan.com",
  });

  return { token };
});

export default app;
