import { knex as setupKnex, Knex } from "knex";

export const databaseConfig: Knex.Config = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./src/database/app.db",
  },
  migrations: {
    extension: "ts",
    directory: "src/database/migrations",
  },
};

export const knex = setupKnex(databaseConfig);
