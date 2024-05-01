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

  app.put(
    "/:id",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request, reply) => {
      const paramSchema = z.object({ id: z.string().uuid() });
      const { id } = paramSchema.parse(request.params);

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        isOnDiet: z.boolean().optional(),
        date: z.coerce.date().optional(),
      });

      const body = updateMealBodySchema.parse(request.body);

      const meal = await knex("meals").where("id", id).first();

      if (!meal) return reply.status(404).send({ error: "Meal not found" });

      await knex("meals")
        .update({
          ...(body.name && { name: body.name }),
          ...(body.description && { description: body.description }),
          ...(body.isOnDiet && { is_on_diet: body.isOnDiet }),
          ...(body.date && { date: body.date }),
        })
        .where("id", id);

      return reply.status(204).send();
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request, reply) => {
      const paramSchema = z.object({ id: z.string().uuid() });
      const { id } = paramSchema.parse(request.params);

      const meal = await knex("meals").where("id", id).first();

      if (!meal) return reply.status(404).send({ error: "Meal not found" });

      return { meal };
    },
  );

  app.delete(
    "/:id",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request, reply) => {
      const paramSchema = z.object({ id: z.string().uuid() });
      const { id } = paramSchema.parse(request.params);

      const meal = await knex("meals").where("id", id).first();

      if (!meal) return reply.status(404).send({ error: "Meal not found" });

      await knex("meals").where("id", id).del();

      return reply.status(204).send();
    },
  );
}
