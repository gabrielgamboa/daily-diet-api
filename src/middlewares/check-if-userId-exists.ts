import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database/config";

export async function checkIfUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.userId;

  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const user = await knex("users").where("id", userId).select("*").first();

  if (!user) return reply.status(401).send({ error: "Unauthorized" });

  request.user = user;
}
