import { FastifyInstance } from "fastify";
import { checkIfUserIdExists } from "../middlewares/check-if-userId-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/meals",
    {
      preHandler: [checkIfUserIdExists],
    },
    async (request, reply) => {},
  );
}
