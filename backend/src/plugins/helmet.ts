import fp from "fastify-plugin";
import fastifyHelmet from "@fastify/helmet";
import { FastifyInstance } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(fastifyHelmet, {
    global: true,
  });
});
