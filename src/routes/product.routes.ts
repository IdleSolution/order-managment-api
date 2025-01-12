import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { addProduct } from '../handlers/product/commands/addProduct';
import { listProducts } from '../handlers/product/queries/listProducts';
import { restockProduct } from '../handlers/product/commands/restockProduct';
import { sellProduct } from '../handlers/product/commands/sellProduct';

const router = express.Router();

router.post(
    '/',
    [
        body('name').isString().withMessage('Name must be a string'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('stock')
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        validateRequest,
    ],
    addProduct,
);

router.get('/', listProducts);

router.patch(
    '/restock',
    [
        body('productId').isString().withMessage('Product ID must be a string'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        validateRequest,
    ],
    restockProduct,
);

router.patch(
    '/sell',
    [
        body('productId').isString().withMessage('Product ID must be a string'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        validateRequest,
    ],
    sellProduct,
);

export default router;
