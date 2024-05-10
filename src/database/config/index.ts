import { knex as setupKnex, Knex } from "knex";
import path from "path";
import { env } from "../../env";

export const databaseConfig: Knex.Config = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: path.resolve(__dirname, "..", env.DATABASE_URL),
  },
  migrations: {
    extension: "ts",
    directory: "src/database/migrations",
  },
};

export const knex = setupKnex(databaseConfig);
