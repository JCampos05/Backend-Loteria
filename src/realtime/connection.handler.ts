import type { Server, Socket } from 'socket.io';
import type { IRoomRepository } from '../domain/repositories/IRoomRepository';
import { SOCKET_EVENTS, type RoomJoinPayload } from './events';
import { SocketRegistry } from './socket-registry';

export function registerConnectionHandlers(io: Server, roomRepository: IRoomRepository): void {
    const registry = new SocketRegistry();

    io.on('connection', (socket: Socket) => {
        socket.on(SOCKET_EVENTS.ROOM_JOIN, async (payload: RoomJoinPayload) => {
            try {
                await handleRoomJoin(socket, roomRepository, registry, payload);
            } catch (error) {
                console.error('[realtime] Error en room:join:', error);
                socket.emit(SOCKET_EVENTS.ERROR, {
                    code: 'ROOM_JOIN_FAILED',
                    message: 'No se pudo unir el socket a la sala',
                });
            }
        });

        socket.on('disconnect', () => {
            const info = registry.detach(socket.id);
            if (!info) return;

            socket.to(info.roomId).emit(SOCKET_EVENTS.ROOM_PLAYER_LEFT, {
                playerId: info.playerId,
            });
        });
    });
}

async function handleRoomJoin(
    socket: Socket,
    roomRepository: IRoomRepository,
    registry: SocketRegistry,
    payload: RoomJoinPayload,
): Promise<void> {
    if (!payload?.roomId || !payload?.playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, {
            code: 'INVALID_PAYLOAD',
            message: 'roomId y playerId son requeridos',
        });
        return;
    }

    const room = await roomRepository.findById(payload.roomId);
    if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR, {
            code: 'ROOM_NOT_FOUND',
            message: `No existe una sala con id ${payload.roomId}`,
        });
        return;
    }

    const player = await roomRepository.findPlayerById(payload.playerId);
    if (!player || player.roomId !== room.id) {
        socket.emit(SOCKET_EVENTS.ERROR, {
            code: 'PLAYER_NOT_FOUND',
            message: 'El jugador no pertenece a esta sala',
        });
        return;
    }

    await socket.join(room.id);
    registry.attach(socket.id, { roomId: room.id, playerId: player.id });

    const players = await roomRepository.getPlayersByRoomId(room);

    socket.emit(SOCKET_EVENTS.ROOM_STATE, { room, players });
    socket.to(room.id).emit(SOCKET_EVENTS.ROOM_PLAYER_JOINED, { player });
}
