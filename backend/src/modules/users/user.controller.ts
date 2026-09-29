import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserData } from "./users.interface.js";
import { UsersService } from "./users.service.js";
import { success } from "../../libs/response.js";
import { RegisterData } from "../auth/auth.interface.js";

type UserIdParams = {
  id: string;
};

type UsernameParams = {
  username: string;
};

type UserServiceType = ReturnType<typeof UsersService>;
export const UserController = (service: UserServiceType) => ({
  register: async (
    request: FastifyRequest<{ Body: RegisterData }>,
    reply: FastifyReply,
  ) => {
    const user = await service.register(request.body);
    return success(reply, user, "Register Successfully!");
  },

  getAllUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await service.getAllUser();
    return success(reply, users);
  },
  getUserById: async (
    request: FastifyRequest<{ Params: UserIdParams }>,
    reply: FastifyReply,
  ) => {
    const id = Number(request.params.id);
    const users = await service.getUserById(id);
    return success(reply, users);
  },
  getUserByUsername: async (
    request: FastifyRequest<{ Params: UsernameParams }>,
    reply: FastifyReply,
  ) => {
    const username = request.params.username;
    const user = await service.getUserByUsername(username);
    return success(reply, user);
  },
  updateUser: async (
    request: FastifyRequest<{ Params: UserIdParams; Body: UpdateUserData }>,
    reply: FastifyReply,
  ) => {
    const id = Number(request.params.id);
    const data = request.body;

    const updateUser = await service.updatedUser(id, data);
    return success(reply, updateUser);
  },
  deleteUser: async (
    request: FastifyRequest<{ Params: UserIdParams }>,
    reply: FastifyReply,
  ) => {
    const id = Number(request.params.id);
    const deletedUser = await service.deletedUser(id);
    return success(reply, deletedUser);
  },
});
