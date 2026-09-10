import { z } from 'zod';

export const calledCardSchema = z.object({
    id: z.string(),
    gameId: z.string(),
    cardId: z.number().int().positive(),
    callOrder: z.number().int().positive(),
    calledAt: z.date(),
});

export type CalledCardDto = z.infer<typeof calledCardSchema>;