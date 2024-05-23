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

    const cookies = userResponse.headers["set-cookie"];

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Almoço",
        description: "arroz, feijão, carne",
        isOnDiet: true,
        date: "2024-04-29 12:00:00",
      })
      .expect(201);
  });

  it("should be able to list all meals", async () => {
    const userResponse = await request(app.server).post("/users").send({
      name: "Gabriel",
      email: "gabriel@gmail.com",
    });

    const cookies = userResponse.headers["set-cookie"];

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "arroz, feijão, carne",
      isOnDiet: true,
      date: "2024-04-29 12:00:00",
    });

    const meals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(meals.body.meals).toHaveLength(1);
    expect(meals.body.meals[0].name).toBe("Almoço");
  });

  it("should be able to list all meals", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel",
        email: "gabriel@gmail.com",
      })
      .expect(201);

    const cookies = userResponse.headers["set-cookie"];

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Almoço",
        description: "arroz, feijão, carne",
        isOnDiet: true,
        date: "2024-04-29 12:00:00",
      })
      .expect(201);

    const meals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(meals.body.meals).toHaveLength(1);
    expect(meals.body.meals[0].name).toBe("Almoço");
  });

  it("should be able to list a meal by id", async () => {
    const userResponse = await request(app.server).post("/users").send({
      name: "Gabriel",
      email: "gabriel@gmail.com",
    });
    const cookies = userResponse.headers["set-cookie"];

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "arroz, feijão, carne",
      isOnDiet: true,
      date: "2024-04-29 12:00:00",
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Janta",
      description: "arroz e legumes",
      isOnDiet: false,
      date: "2024-04-30 12:00:00",
    });

    const meals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    const id = meals.body.meals[0].id;

    const meal = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(meal.body.meal).toEqual(
      expect.objectContaining({
        name: "Almoço",
        description: "arroz, feijão, carne",
      }),
    );
  });

  it("should be able to update a meal by id", async () => {
    const userResponse = await request(app.server).post("/users").send({
      name: "Gabriel",
      email: "gabriel@gmail.com",
    });
    const cookies = userResponse.headers["set-cookie"];

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "arroz, feijão, carne",
      isOnDiet: true,
      date: "2024-04-29 12:00:00",
    });

    const meals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    const id = meals.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${id}`)
      .set("Cookie", cookies)
      .send({
        description: "Pastelzão",
        isOnDiet: false,
      })
      .expect(204);

    const mealUpdated = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", cookies);

    expect(mealUpdated.body.meal).toEqual(
      expect.objectContaining({
        description: "Pastelzão",
      }),
    );
  });

  it("should be able to delete a meal by id", async () => {
    const userResponse = await request(app.server).post("/users").send({
      name: "Gabriel",
      email: "gabriel@gmail.com",
    });
    const cookies = userResponse.headers["set-cookie"];

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "arroz, feijão, carne",
      isOnDiet: true,
      date: "2024-04-29 12:00:00",
    });

    const meals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    const id = meals.body.meals[0].id;

    await request(app.server).delete(`/meals/${id}`).set("Cookie", cookies);

    const newMeals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    expect(newMeals.body.meals).toHaveLength(0);
  });

  it("should be able to get meal metrics from user", async () => {
    const userResponse = await request(app.server).post("/users").send({
      name: "Gabriel",
      email: "gabriel@gmail.com",
    });
    const cookies = userResponse.headers["set-cookie"];

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "arroz, feijão, carne",
      isOnDiet: true,
      date: "2024-04-29 12:00:00",
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Janta",
      description: "lanche brabo",
      isOnDiet: false,
      date: "2024-04-29 21:00:00",
    });

    const metrics = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookies)
      .expect(200);

    expect(metrics.body).toEqual({
      totalMealsRegistered: 2,
      totalMealsRegisteredOnDiet: 1,
      totalMealsRegisteredNotOnDiet: 1,
      bestSequenceOnDiet: 1,
    });
  });
});
