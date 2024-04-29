import { FastifyInstance } from "fastify";
import { checkIfUserIdExists } from "../middlewares/check-if-userId-exists";
import { z } from "zod";
import { knex } from "../database/config";
import { randomUUID } from "crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      );

      const userId = request.user?.id;

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        user_id: userId,
        date, // ver como tá salvando o date
        is_on_diet: isOnDiet,
      });

      return reply.status(201).send();
    },
  );

  app.get(
    "/",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request) => {
      const userId = request.user.id;

      const meals = await knex("meals").where("user_id", userId).select("*");

      return { meals };
    },
  );
}
