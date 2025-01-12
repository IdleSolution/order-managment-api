import Product from '../../../models/product.model';
import { NextFunction, Request, Response } from 'express';

export const listProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err: unknown) {
        next(err);
    }
};
