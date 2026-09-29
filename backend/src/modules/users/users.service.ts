import { FastifyInstance } from "fastify";
import { UsersRepository } from "./users.repository.js";
import { UpdateUserData } from "./users.interface.js";
import { RegisterData } from "../auth/auth.interface.js";
import { Bcrypt } from "../../libs/bcrypt.js";

type UserRepositoryType = ReturnType<typeof UsersRepository>;

export const UsersService = (
  UsersRepository: UserRepositoryType,
  fastify: FastifyInstance,
) => ({
  register: async (data: RegisterData) => {
    const hashed_password = await Bcrypt.hash(data.password);

    let payload = {
      store_id: data.store_id,
      role_id: data.role_id,
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      password: hashed_password,
    };

    const register = await UsersRepository.register(payload);

    return register;
  },
  getAllUser: async () => {
    const users = await UsersRepository.getAll();
    return users;
  },
  getUserById: async (id: number) => {
    const user = await UsersRepository.getById(id);
    return user;
  },
  getUserByUsername: async (username: string) => {
    const user = await UsersRepository.getByUsername(username);
    return user;
  },
  updatedUser: async (id: number, user: UpdateUserData) => {
    const updatedUser = await UsersRepository.updated(id, user);
    return updatedUser;
  },
  deletedUser: async (id: number) => {
    const deletedUser = await UsersRepository.deleted(id);
    return deletedUser;
  },
});
