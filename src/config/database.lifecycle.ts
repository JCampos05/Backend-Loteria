import { disconnectDatabase } from './prisma.client';

export function registerDatabaseShutdownHooks(): void {
    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
        if (isShuttingDown) return;
        isShuttingDown = true;

        console.log(`[db] Señal ${signal} recibida, cerrando conexión...`);
        try {
            await disconnectDatabase();
            process.exit(0);
        } catch (error) {
            console.error('[db] Error al cerrar la conexión:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}