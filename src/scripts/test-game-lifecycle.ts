/**
 * Script de prueba manual para el ciclo de vida de la partida.
 * No depende de Postgres ni de Prisma: usa InMemoryGameRepository.
 *
 * Cómo correrlo (desde la raíz del proyecto, una vez copiados estos
 * archivos a tu rama):
 *
 *   npx tsx src/scripts/test-game-lifecycle.ts
 */
import { GameLifecycleService, InvalidGameTransitionError } from '../application/game/GameLifecycleService';
import { InMemoryGameRepository } from '../Infrastructure/repositories/InMemoryGameRepository';

async function main() {
    const repository = new InMemoryGameRepository();
    const service = new GameLifecycleService(repository);
    const roomId = 'room-demo-1';

    console.log('--- 1) Crear partida (nace en WAITING) ---');
    const game = await service.createGame(roomId);
    console.log(game);

    console.log('\n--- 2) Iniciar partida: WAITING -> PLAYING ---');
    const started = await service.startGame(game.id);
    console.log(started);

    console.log('\n--- 3) Intentar iniciarla de nuevo (debe fallar) ---');
    try {
        await service.startGame(game.id);
    } catch (error) {
        if (error instanceof InvalidGameTransitionError) {
            console.log('OK, error esperado ->', error.message);
        } else {
            throw error;
        }
    }

    console.log('\n--- 4) Finalizar partida: PLAYING -> FINISHED ---');
    const finished = await service.finishGame(game.id, 'player-123');
    console.log(finished);

    console.log('\n--- 5) Reiniciar la sala (crea una partida nueva) ---');
    const restarted = await service.restartGame(roomId);
    console.log(restarted);
}

main().catch((error) => {
    console.error('Error en el test:', error);
    process.exit(1);
});
