import { Request, Response, NextFunction } from 'express';
import Product from '../../../models/product.model';
import { NotFoundError } from '../../../types/errors';

interface RestockProductRequestBody {
    productId: string;
    quantity: number;
}

export const restockProduct = async (
    req: Request<{}, {}, RestockProductRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) throw new NotFoundError('Product not found');

        product.stock += quantity;
        await product.save();

        res.status(200).json(product);
    } catch (err: unknown) {
        next(err);
    }
};
