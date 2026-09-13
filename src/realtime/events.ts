import type { Room } from '../domain/entities/room';
import type { Player } from '../domain/entities/player';

export const SOCKET_EVENTS = {
    // Cliente -> Servidor
    ROOM_JOIN: 'room:join',

    // Servidor -> Cliente
    ROOM_STATE: 'room:state',
    ROOM_PLAYER_JOINED: 'room:player-joined',
    ROOM_PLAYER_LEFT: 'room:player-left',
    ERROR: 'error',
} as const;

export interface RoomJoinPayload {
    roomId: string;
    playerId: string;
}

export interface RoomStatePayload {
    room: Room;
    players: Player[];
}

export interface RoomPlayerJoinedPayload {
    player: Player;
}

export interface RoomPlayerLeftPayload {
    playerId: string;
}

export interface SocketErrorPayload {
    code: string;
    message: string;
}
