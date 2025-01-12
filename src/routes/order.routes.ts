import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { createOrder } from '../handlers/order/commands/createOrder';

const router = express.Router();

router.post(
    '/',
    [
        body('customerId')
            .isString()
            .withMessage('Customer ID must be a string'),
        body('products')
            .isArray({ min: 1 })
            .withMessage('Products must be an array with at least one item'),
        body('products.*.productId')
            .isString()
            .withMessage('Each product ID must be a string'),
        body('products.*.quantity')
            .isInt({ min: 1 })
            .withMessage('Each quantity of product must be a positive integer'),
        validateRequest,
    ],
    createOrder,
);

export default router;
