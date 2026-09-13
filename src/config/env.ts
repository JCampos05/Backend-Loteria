import 'dotenv/config'
import { z } from 'zod'
import { buildDatabaseUrl, buildDirectDatabaseUrl } from './database-url';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: z.string().default('*'),

    DB_HOST: z.string().min(1, 'Se requiere DB_HOST'),
    DB_PORT: z.coerce.number().positive().default(6543),
    DB_DIRECT_PORT: z.coerce.number().positive().default(5432),
    DB_USER: z.string().min(1, 'Se requiere DB_USER'),
    DB_PASSWORD: z.string().min(1, 'Se requiere DB_PASSWORD'),
    DB_NAME: z.string().min(1, 'Se requier DB_NAME'),

    DB_SSL: z.enum(['true', 'false']).default('true').transform((v) => v === 'true'),
    DB_CONNECTION_LIMIT: z.coerce.number().int().positive().default(5),
});

function loadEnv() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('Variables de entorno inválidas o faltantes:\n');
        for (const issue of parsed.error.issues) {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    const data = parsed.data;

    const databaseUrl = buildDatabaseUrl({
        host: data.DB_HOST,
        port: data.DB_PORT,
        user: data.DB_USER,
        password: data.DB_PASSWORD,
        name: data.DB_NAME,
        ssl: data.DB_SSL,
        connectionLimit: data.DB_CONNECTION_LIMIT
    });

    const directUrl = buildDirectDatabaseUrl({
        host: data.DB_HOST,
        port: data.DB_DIRECT_PORT,
        user: data.DB_USER,
        password: data.DB_PASSWORD,
        name: data.DB_NAME,
        ssl: data.DB_SSL,
    });

    return {
        nodoEnv: data?.NODE_ENV,
        isProduction: data?.NODE_ENV === 'production',
        port: data?.PORT,
        corsOrigin: data?.CORS_ORIGIN,
        database: {
            host: data?.DB_HOST,
            port: data?.DB_PORT,
            directPort: data?.DB_DIRECT_PORT,
            name: data?.DB_NAME,
            ssl: data?.DB_SSL,
            connectionLimit: data?.DB_CONNECTION_LIMIT,
            url: databaseUrl,
            directUrl,
        },
    } as const;
}

export const env = loadEnv();
export type Env = typeof env;