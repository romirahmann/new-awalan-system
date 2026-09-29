import { FastifyReply } from "fastify";

export const success = (
  reply: FastifyReply,
  data: unknown,
  message = "Success",
  status = 200,
) => {
  return reply.status(status).send({
    success: true,
    message,
    data,
  });
};
