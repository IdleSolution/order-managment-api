import { Request, Response, NextFunction } from 'express';
import Product from '../../../models/product.model';
import { BadRequestError, NotFoundError } from '../../../types/errors';

interface SellProductRequestBody {
    productId: string;
    quantity: number;
}

export const sellProduct = async (
    req: Request<{}, {}, SellProductRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) throw new NotFoundError('Product not found');
        if (product.stock < quantity)
            throw new BadRequestError('Insufficient stock');

        product.stock -= quantity;
        await product.save();

        res.status(200).json(product);
    } catch (err: unknown) {
        next(err);
    }
};
