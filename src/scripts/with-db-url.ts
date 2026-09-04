import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { buildDatabaseUrl } from '../config/database-url';

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;

for (const key of required) {
    if (!process.env[key]) {
        console.error(`Falta la variable ${key} en tu .env`);
        process.exit(1);
    }
}

const databaseUrl = buildDatabaseUrl({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    ssl: (process.env.DB_SSL ?? 'true') === 'true',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 5),
});

const prismaArgs = process.argv.slice(2);

const result = spawnSync('npx', ['prisma', ...prismaArgs], {
    stdio: 'inherit',
    env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
    },
});

process.exit(result.status ?? 1);