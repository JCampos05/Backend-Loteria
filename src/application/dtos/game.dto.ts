import { z } from 'zod';
import { GameStatus } from '../../domain/enums/game-status';

//Los datos del schema estan "hardcodeados/predefinidos" no puse entrada

//Salida 
export const gameSchema = z.object({
    id: z.string(),
    roomID: z.string(),
    status: z.nativeEnum(GameStatus),
    winnerId: z.string().nullable(),
    startedAt: z.date(),
    endedAt: z.date().nullable(),
});

export type GameDto = z.infer<typeof gameSchema>;