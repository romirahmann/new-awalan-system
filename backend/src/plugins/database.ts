import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { db } from "../database/knex.js";
export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate("db", db);
});
