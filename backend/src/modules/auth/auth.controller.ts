import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import { RegisterData } from "./auth.interface.js";
import { success } from "../../libs/response.js";

type AuthServiceType = ReturnType<typeof AuthService>;

export const AuthController = (service: AuthServiceType) => ({
  login: async (
    request: FastifyRequest<{ Body: RegisterData }>,
    reply: FastifyReply,
  ) => {
    const user = await service.login(request.body);

    reply.setCookie("access_token", user.token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return success(reply, user.user, "User Login Successfully!");
  },

  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("access_token", {
      path: "/",
    });
    return reply.code(200).send({
      success: true,
      message: "Logout berhasil",
    });
  },
});
