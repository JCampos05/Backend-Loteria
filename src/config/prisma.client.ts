import {PrismaClient} from '@prisma/client'
import { env } from './env'

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url:env.database.url,
        },
    },
    log: env.isProduction ? [ 'error', 'warn'] : ['error', 'warn', 'query'],
});

export async function connectDatabase(): Promise<void> {
    await prisma.$connect();
    console.log(`[db] Conectado a Postgres (${env.database.host}:${env.database.port}/${env.database.name})`);
}

export async function disconnectDatabase(): Promise <void> {
    await prisma.$disconnect();
    console.log('[db] Conexión a Postgres cerrada');
}