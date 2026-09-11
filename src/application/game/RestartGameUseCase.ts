import { Game } from '../../domain/entities/game';
import { GameLifecycleService } from './GameLifecycleService';

export interface RestartGameInput {
    roomId: string;
}

export class RestartGameUseCase {
    constructor(private readonly lifecycleService: GameLifecycleService) {}

    async execute({ roomId }: RestartGameInput): Promise<Game> {
        return this.lifecycleService.restartGame(roomId);
    }
}
