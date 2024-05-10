import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest";

describe("Meals", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  });

  it("should be able to create a meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel",
        email: "gabriel@gmail.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie") as string[])
      .send({
        name: "Almoço",
        description: "arroz, feijão, carne",
        isOnDiet: true,
        date: "2024-04-29 12:00:00",
      })
      .expect(201);
  });
});
