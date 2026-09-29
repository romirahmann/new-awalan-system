import { FastifyInstance } from "fastify";
import { Bcrypt } from "../../libs/bcrypt.js";
import { LoginData, RegisterData } from "./auth.interface.js";
import { AuthRepository } from "./auth.repository.js";
import dayjs from "dayjs";

type AuthRepositoryType = ReturnType<typeof AuthRepository>;

export const AuthService = (
  repository: AuthRepositoryType,
  fastify: FastifyInstance,
) => ({
  login: async (data: LoginData) => {
    const user = await repository.login(data.username);

    if (!user) {
      throw new Error("User Not Found!");
    }

    const pw_is_valid = await Bcrypt.compare(data.password, user.password);

    if (!pw_is_valid) {
      throw new Error("Wrong Password!");
    }

    await repository.lastLogin(user.username);

    const dataUser = await repository.login(data.username);

    const payload = {
      id: dataUser.id,
      store_id: dataUser.store_id,
      role_id: dataUser.role_id,
      username: dataUser.username,
      full_name: dataUser.full_name,
      email: dataUser.email,
    };

    const token = await fastify.jwt.sign(payload);

    return {
      token,
      user: {
        ...dataUser,
        last_login_at: dayjs(dataUser.last_login_at).format(
          "ddd, DD MMM YYYY HH:mm:ss",
        ),
        password: undefined,
      },
    };
  },
});
