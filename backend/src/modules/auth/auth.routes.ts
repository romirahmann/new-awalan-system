import { FastifyInstance } from "fastify";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

export default async function AuthRoute(fastify: FastifyInstance) {
  const repository = AuthRepository(fastify.db);
  const services = AuthService(repository, fastify);
  const controller = AuthController(services);

  fastify.post("/login", controller.login);
  fastify.post("/logout", controller.logout);
}
