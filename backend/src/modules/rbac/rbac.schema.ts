import { FastifySchema } from "fastify";

export const insertRolePermessionSchema = {
  body: {
    type: "array",
    minItems: 1,
    items: {
      type: "object",
      required: ["role_name", "permission_code"],
      properties: {
        role_name: {
          type: "string",
          minLength: 1,
        },
        permission_code: {
          type: "string",
          minLength: 1,
        },
      },
    },
  },
} satisfies FastifySchema;
