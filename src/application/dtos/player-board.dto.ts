import { z } from 'zod';

export const playerBoardSchema = z.object({
    id: z.string(),
    gameId: z.string(),
    playerId: z.string(),
});

export type PlayerBoardDto = z.infer<typeof playerBoardSchema>;