import { Game } from '../../domain/entities/game';
import { GameStatus } from '../../domain/enums/game-status';
import { IGameRepository } from '../../repositories/IGameRepository';

/** Transiciones de estado permitidas para una partida. */
const ALLOWED_TRANSITIONS: Record<GameStatus, GameStatus[]> = {
    [GameStatus.WAITING]: [GameStatus.PLAYING],
    [GameStatus.PLAYING]: [GameStatus.FINISHED],
    [GameStatus.FINISHED]: [],
};

export class InvalidGameTransitionError extends Error {
    constructor(from: GameStatus, to: GameStatus) {
        super(`No se puede pasar de ${from} a ${to}`);
        this.name = 'InvalidGameTransitionError';
    }
}

export class GameNotFoundError extends Error {
    constructor(gameId: string) {
        super(`No existe una partida con id ${gameId}`);
        this.name = 'GameNotFoundError';
    }
}

/**
 * Encapsula el ciclo de vida de una partida (Game): inicio, transición de
 * estados, reinicio y finalización. Es el "corazón" del entregable de César.
 *
 * No sabe nada de Socket.IO ni de Express: solo orquesta la entidad Game a
 * través de IGameRepository. Los eventos en tiempo real (avisar a los
 * jugadores que la partida empezó/terminó) los dispara quien use este
 * servicio desde la capa de real-time (Juan Pablo / Ismael), no el servicio
 * en sí.
 */
export class GameLifecycleService {
    constructor(private readonly gameRepository: IGameRepository) {}

    /** Crea una nueva partida para una sala. Nace siempre en WAITING. */
    async createGame(roomId: string): Promise<Game> {
        return this.gameRepository.create({ roomId });
    }

    /** WAITING -> PLAYING */
    async startGame(gameId: string): Promise<Game> {
        const game = await this.getGameOrThrow(gameId);
        this.assertTransition(game.status, GameStatus.PLAYING);
        return this.gameRepository.updateStatus(gameId, GameStatus.PLAYING);
    }

    /** PLAYING -> FINISHED */
    async finishGame(gameId: string, winnerId: string | null = null): Promise<Game> {
        const game = await this.getGameOrThrow(gameId);
        this.assertTransition(game.status, GameStatus.FINISHED);
        return this.gameRepository.finish(gameId, winnerId);
    }

    /**
     * "Reiniciar" una partida no significa mutar una partida ya FINISHED:
     * cada partida jugada queda como registro histórico. Reiniciar = cerrar
     * cualquier partida activa que quedara abierta en la sala y abrir una
     * partida nueva en WAITING para la siguiente ronda.
     */
    async restartGame(roomId: string): Promise<Game> {
        const active = await this.gameRepository.findActiveByRoomId(roomId);

        if (active) {
            await this.gameRepository.finish(active.id, null);
        }

        return this.createGame(roomId);
    }

    private assertTransition(current: GameStatus, next: GameStatus): void {
        const allowed = ALLOWED_TRANSITIONS[current];
        if (!allowed.includes(next)) {
            throw new InvalidGameTransitionError(current, next);
        }
    }

    private async getGameOrThrow(gameId: string): Promise<Game> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) {
            throw new GameNotFoundError(gameId);
        }
        return game;
    }
}
