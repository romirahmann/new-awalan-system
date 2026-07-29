import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";

export default fp(async function (fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      const statusCode = error.statusCode ?? 500;
      reply.status(statusCode).send({
        success: false,
        message: statusCode === 500 ? "Internal Server Error" : error.message,
      });
    },
  );
});
