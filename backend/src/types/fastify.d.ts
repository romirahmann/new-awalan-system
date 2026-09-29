import { Knex } from "knex";

declare module "fastify" {
  interface FastifyInstance {
    db: Knex;
    bcrypt: {
      hash(password: string): Promise<string>;
      compare(password: string, hash: string): Promise<boolean>;
    };
  }
}
