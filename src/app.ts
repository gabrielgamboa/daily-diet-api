import fastify from "fastify";
import { userRoutes } from "./routes/user.routes";
import { mealsRoutes } from "./routes/meals.routes";
import cookies from "@fastify/cookie";

export const app = fastify();

app.register(cookies);

app.register(userRoutes, {
  prefix: "/users",
});
app.register(mealsRoutes, {
  prefix: "/meals",
});
