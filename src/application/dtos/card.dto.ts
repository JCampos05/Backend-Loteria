import { z } from 'zod';

export const cardSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    imageUrl: z.string(),
});

export type CardDto = z.infer<typeof cardSchema>;