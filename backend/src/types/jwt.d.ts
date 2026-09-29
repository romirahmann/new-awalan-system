import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      role_id: number;
    };

    user: {
      role_id: number;
    };
  }
}
