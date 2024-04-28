import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database/config";
import { randomUUID } from "crypto";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string().min(5),
      email: z.string(),
    });

    const { email, name } = createUserSchema.parse(request.body);

    const userId = randomUUID();

    // register userId in cookie session
    reply.setCookie("userId", userId, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 Days in seconds
    });

    await knex("users").insert({
      id: userId,
      email,
      name,
    });

    return reply.status(201).send();
  });
}
