import { z } from 'zod';

export const winClaimSchema = z.object({
    id: z.string(),
    gameId: z.string(),
    playerId: z.string(),
    isValid: z.boolean(),
    reason: z.string().nullable(),
    claimedAt: z.date(),
});

export type WinClaimDto = z.infer<typeof winClaimSchema>;