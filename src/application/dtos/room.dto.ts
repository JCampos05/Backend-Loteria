import { z } from 'zod';
import { RoomStatus} from '../../domain/enums/room-status';

// Entrada
export const createRoomSchema = z.object({
    code: z.string().length(8, 'Codigo de maximo 8 caratceres')
});

//Salida
export const RoomSchema = z.object({
    id: z.string(),
    code: z.string(),
    status: z.nativeEnum(RoomStatus),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type createRoomDto = z.infer<typeof createRoomSchema>;
export type RoomDto = z.infer<typeof RoomSchema>;