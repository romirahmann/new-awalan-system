import app from "./app.js";
import { env } from "./config/env.js";
const start = async () => {
  try {
    await app.listen({
      host: env.APP_HOST,
      port: env.APP_PORT,
    });
    console.log(
      `🚀 ${env.APP_NAME} running at http://${env.APP_HOST}:${env.APP_PORT}`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
