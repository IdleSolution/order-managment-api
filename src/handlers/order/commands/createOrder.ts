import { Request, Response, NextFunction } from 'express';
import Product from '../../../models/product.model';
import { BadRequestError, NotFoundError } from '../../../types/errors';
import Order from '../../../models/order.model';

interface CreateOrderRequestBody {
    customerId: string;
    products: {
        productId: string;
        quantity: number;
    }[];
}

export const createOrder = async (
    req: Request<{}, {}, CreateOrderRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { customerId, products } = req.body;
        const productUpdates = [];

        for (const { productId, quantity } of products) {
            const product = await Product.findById(productId);
            if (!product)
                throw new NotFoundError(
                    `Product with ID ${productId} not found`,
                );
            if (product.stock < quantity)
                throw new BadRequestError(
                    `Insufficient stock for product ${product.name}`,
                );

            product.stock -= quantity;
            productUpdates.push(product.save());
        }

        await Promise.all(productUpdates);

        const order = new Order({ customerId, products });
        await order.save();

        res.status(201).json(order);
    } catch (err: unknown) {
        next(err);
    }
};
