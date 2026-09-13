import { env } from './config/env';
import { connectDatabase } from './config/prisma.client';
import { registerDatabaseShutdownHooks } from './config/database.lifecycle';
import { createServer } from './server';
import { registerConnectionHandlers } from './realtime/connection.handler';
import { PrismaRoomRepository } from './infrastructure/repositories/PrismaRoomRepository';

async function bootstrap() {
    await connectDatabase();
    registerDatabaseShutdownHooks();

    const { httpServer, io } = createServer();

    const roomRepository = new PrismaRoomRepository();
    registerConnectionHandlers(io, roomRepository);

    httpServer.listen(env.port, () => {
        console.log(`[server] Escuchando en el puerto ${env.port} (${env.nodoEnv})`);
    });
}

bootstrap().catch((error) => {
    console.error('[server] Error al iniciar:', error);
    process.exit(1);
});
