import { randomUUID } from 'node:crypto';
import { Game } from '../domain/entities/game';
import { GameStatus } from '../domain/enums/game-status';
import { IGameRepository, ICreateGameData } from './IGameRepository';

/**
 * Implementación en memoria de IGameRepository.
 *
 * Sirve para probar GameLifecycleService sin depender de Postgres/Prisma.
 * NO es la implementación final: esa le corresponde a Adrián Montes con
 * Prisma. Útil mientras tanto para pruebas locales y, más adelante, para
 * pruebas automatizadas (unit tests) del ciclo de vida de la partida.
 */
export class InMemoryGameRepository implements IGameRepository {
    private readonly games = new Map<string, Game>();

    async create({ roomId }: ICreateGameData): Promise<Game> {
        const game: Game = {
            id: randomUUID(),
            roomId,
            status: GameStatus.WAITING,
            winnerId: null,
            startedAt: new Date(),
            endedAt: null,
        };

        this.games.set(game.id, game);
        return game;
    }

    async findById(id: string): Promise<Game | null> {
        return this.games.get(id) ?? null;
    }

    async findActiveByRoomId(roomId: string): Promise<Game | null> {
        const match = [...this.games.values()]
            .filter((game) => game.roomId === roomId)
            .find((game) => game.status !== GameStatus.FINISHED);

        return match ?? null;
    }

    async updateStatus(id: string, status: GameStatus): Promise<Game> {
        const game = this.mustGet(id);
        const updated: Game = { ...game, status };
        this.games.set(id, updated);
        return updated;
    }

    async finish(id: string, winnerId: string | null): Promise<Game> {
        const game = this.mustGet(id);
        const updated: Game = {
            ...game,
            status: GameStatus.FINISHED,
            winnerId,
            endedAt: new Date(),
        };
        this.games.set(id, updated);
        return updated;
    }

    private mustGet(id: string): Game {
        const game = this.games.get(id);
        if (!game) {
            throw new Error(`InMemoryGameRepository: no existe una partida con id ${id}`);
        }
        return game;
    }
}
