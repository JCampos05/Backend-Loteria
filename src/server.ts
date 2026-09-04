import { createServer as createHttpServer } from 'node:http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { indexRouter } from './routes/index.routes';

export function createServer() {
    const app = express();

    app.use(express.json());
    app.use('/api', indexRouter);

    const httpServer = createHttpServer(app);
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        },
    });

    return { app, httpServer, io };
}
