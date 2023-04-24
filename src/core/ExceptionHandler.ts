import ApplicationError from '@/core/ApplicationError';
import { NextFunction, Request, Response } from 'express';

export default async function ExceptionHandler(err: Error, req: Request, res: Response, _: NextFunction) {
    console.error(err);
    if (err instanceof ApplicationError) {
        return res.status(err.httpStatusCode).json({ error: err.message, code: err.code, isSuccess: false });
    }

    return res.status(500).json({ error: err.message, code: -1, isSuccess: false });
}
