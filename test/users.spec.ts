import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Users", () => {
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

  it("should be able to create a user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel",
        email: "gabriel@gmail.com",
      })
      .expect(201);
  });
});
