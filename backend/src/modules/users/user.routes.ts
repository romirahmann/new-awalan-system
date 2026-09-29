import { FastifyInstance } from "fastify";
import { UsersRepository } from "./users.repository.js";
import { UsersService } from "./users.service.js";
import { UserController } from "./user.controller.js";

export default async function UserRoute(fastify: FastifyInstance) {
  const repository = UsersRepository(fastify.db);
  const service = UsersService(repository, fastify);
  const controller = UserController(service);

  fastify.get("/", controller.getAllUser);
  fastify.get("/username/:username", controller.getUserByUsername);
  fastify.get("/:id", controller.getUserById);
  fastify.patch("/:id", controller.updateUser);
  fastify.post("/register", controller.register);
}
