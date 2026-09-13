import { createServer as createHttpServer } from 'node:http';
import express from 'express';
import { indexRouter } from './routes/index.routes';
import { createSocketServer } from './realtime/socket-server';

export function createServer() {
    const app = express();

    app.use(express.json());
    app.use('/api', indexRouter);

    const httpServer = createHttpServer(app);
    const io = createSocketServer(httpServer);

    return { app, httpServer, io };
}
