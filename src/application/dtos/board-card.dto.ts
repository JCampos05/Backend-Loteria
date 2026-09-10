import { z } from 'zod';

export const boardCardSchema = z.object({
    id: z.string(),
    playerBoardId: z.string(),
    cardId: z.number().int(),
    position: z.number().int(),
    marked: z.boolean(),
});

export type BoardCardDto = z.infer<typeof boardCardSchema>;