import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastify, { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCookie);
});
