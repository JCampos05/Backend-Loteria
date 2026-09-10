import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { buildDatabaseUrl, buildDirectDatabaseUrl } from '../config/database-url';

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;

for (const key of required) {
    if (!process.env[key]) {
        console.error(`Falta la variable ${key} en tu .env`);
        process.exit(1);
    }
}

const ssl = (process.env.DB_SSL ?? 'true') === 'true';

const databaseUrl = buildDatabaseUrl({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 6543),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    ssl,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 5),
});

const directUrl = buildDirectDatabaseUrl({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_DIRECT_PORT ?? 5432),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    ssl,
});

const prismaArgs = process.argv.slice(2);

const result = spawnSync('npx', ['prisma', ...prismaArgs], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        DIRECT_URL: directUrl,
    },
});

if (result.error) {
    console.error('[db] No se pudo ejecutar prisma:', result.error);
    process.exit(1);
}

process.exit(result.status ?? 1);