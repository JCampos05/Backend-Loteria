import { Game } from '../entities/game';
import { GameStatus } from '../enums/game-status';

export interface ICreateGameData {
    roomId: string;
}

/**
 * Contrato de persistencia para la entidad Game.
 *
 * Nota para el equipo: la implementación real con Prisma le corresponde a
 * Adrián Montes (API + Data / Repositories). Esta interfaz vive aquí porque
 * el caso de uso de ciclo de vida de la partida (GameLifecycleService) la
 * necesita para poder compilar y probarse de forma aislada mientras tanto
 * (ver InMemoryGameRepository.ts).
 */
export interface IGameRepository {
    create(data: ICreateGameData): Promise<Game>;
    findById(id: string): Promise<Game | null>;
    /** Devuelve la partida activa (no FINISHED) más reciente de una sala, si existe. */
    findActiveByRoomId(roomId: string): Promise<Game | null>;
    updateStatus(id: string, status: GameStatus): Promise<Game>;
    finish(id: string, winnerId: string | null): Promise<Game>;
}
