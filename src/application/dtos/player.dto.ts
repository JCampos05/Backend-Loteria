import { z } from 'zod';

//Entrada - esto manda el usuario cuando se une
export const joinRoomSchema = z.object({
    name: z.string().min(1, 'Se necesita nombre').max(40, 'Maximo 40 caracteres'),
});

//Salida
export const playerSchema = z.object({
    id: z.string(),
    roomID: z.string(),
    name: z.string(),
    isHost: z.boolean(),
    connected: z.boolean(),
    socketId: z.string().nullable(),
    joinedAt: z.date(),
});

export type JoinRoomDto = z.infer<typeof joinRoomSchema>;
export type PlayerDto = z.infer<typeof playerSchema>;