import { FastifyReply, FastifyRequest } from "fastify";

export const authGuard = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    request.log.info({
      cookieNames: Object.keys(request.cookies ?? {}),
      hasCookieHeader: Boolean(request.headers.cookie),
      hasAuthorizationHeader: Boolean(request.headers.authorization),
    });
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
};
