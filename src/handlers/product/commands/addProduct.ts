import Product from '../../../models/product.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../../types/errors';

export interface AddProductRequestBody {
    name: string;
    price: number;
    stock: number;
}

export const addProduct = async (
    req: Request<{}, {}, AddProductRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, price, stock } = req.body;

        const product = new Product({ name, price, stock });
        await product.save();

        res.status(201).json(product);
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'ValidationError') {
            next(new BadRequestError(`Invalid data: ${err.message}`));
        } else {
            next(err);
        }
    }
};
