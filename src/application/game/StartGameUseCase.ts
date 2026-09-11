import { Game } from '../../domain/entities/game';
import { GameLifecycleService } from './GameLifecycleService';

export interface StartGameInput {
    gameId: string;
}

export class StartGameUseCase {
    constructor(private readonly lifecycleService: GameLifecycleService) {}

    async execute({ gameId }: StartGameInput): Promise<Game> {
        return this.lifecycleService.startGame(gameId);
    }
}
