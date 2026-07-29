import fp from "fastify-plugin";

import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { env } from "../config/env.js";

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });
});
