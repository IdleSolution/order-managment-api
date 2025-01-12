import { Request, Response } from 'express';
import { CustomError } from '../types/errors';

export const errorHandler = (err: CustomError, req: Request, res: Response) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
};
