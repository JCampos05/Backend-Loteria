import { Game } from '../../domain/entities/game';
import { GameLifecycleService } from './GameLifecycleService';

export interface FinishGameInput {
    gameId: string;
    winnerId?: string | null;
}

export class FinishGameUseCase {
    constructor(private readonly lifecycleService: GameLifecycleService) {}

    async execute({ gameId, winnerId = null }: FinishGameInput): Promise<Game> {
        return this.lifecycleService.finishGame(gameId, winnerId);
    }
}
