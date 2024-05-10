import { config } from "dotenv";
import { z } from "zod";

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
});

const envParsed = envSchema.safeParse(process.env);

console.log(envParsed.data);

if (!envParsed.success)
  throw new Error(`${JSON.stringify(envParsed.error.format())}`);

export const env = envParsed.data;
