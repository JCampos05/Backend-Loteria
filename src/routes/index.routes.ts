import { Router } from 'express';

export const indexRouter = Router();

indexRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
