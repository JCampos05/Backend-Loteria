import { GameStatus } from "../enums/game-status";

export interface Game {
    id: string,
    roomId: string,
    status: GameStatus,
    winnerId: string | null;
    startedAt: Date;
    endedAt: Date | null;
}