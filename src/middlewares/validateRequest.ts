import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../types/errors';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((err) => `${err.type}: ${err.msg}`);
        return next(
            new BadRequestError(
                `Validation Error: ${errorMessages.join(', ')}`,
            ),
        );
    }
    next();
};
