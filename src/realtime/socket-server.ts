import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';

export function createSocketServer(httpServer: HttpServer): SocketIOServer {
    return new SocketIOServer(httpServer, {
        cors: {
            origin: env.corsOrigin,
        },
    });
}
