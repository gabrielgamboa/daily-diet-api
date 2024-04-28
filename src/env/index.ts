import "dotenv/config"
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().default(3333)
})

const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) throw new Error(`${JSON.stringify(envParsed.error.format())}`)

export const env = envParsed.data;