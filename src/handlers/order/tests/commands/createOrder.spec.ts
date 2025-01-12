import { Request, Response } from 'express';
import * as sinon from 'sinon';
import { createOrder } from '../../commands/createOrder';
import Product from '../../../../models/product.model';
import Order from '../../../../models/order.model';
import { BadRequestError, NotFoundError } from '../../../../types/errors';

describe('createOrder Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        req = {
            body: {
                customerId: '12345',
                products: [
                    { productId: '605c72ef153207001f8f8f5', quantity: 10 },
                    { productId: '605c72ef153207001f8f8f6', quantity: 5 },
                ],
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create an order and update product stock successfully', async () => {
        const mockProduct1 = {
            _id: '605c72ef153207001f8f8f5',
            name: 'Product 1',
            stock: 20,
            save: sinon.stub().resolves(true),
        };

        const mockProduct2 = {
            _id: '605c72ef153207001f8f8f6',
            name: 'Product 2',
            stock: 10,
            save: sinon.stub().resolves(true),
        };

        jest.spyOn(Product, 'findById')
            .mockResolvedValueOnce(mockProduct1 as any)
            .mockResolvedValueOnce(mockProduct2 as any);

        const mockOrder = {
            customerId: '12345',
            products: req.body.products,
            save: sinon.stub().resolves(true),
        };

        jest.spyOn(Order.prototype, 'save').mockResolvedValue(mockOrder as any);

        await createOrder(req as Request, res as Response, next);

        expect(mockProduct1.stock).toBe(10);
        expect(mockProduct2.stock).toBe(5);

        expect(res.status).toHaveBeenCalledWith(201);

        sinon.assert.calledOnce(mockProduct1.save);
        sinon.assert.calledOnce(mockProduct2.save);
    });

    it('should return a 404 error if a product is not found', async () => {
        jest.spyOn(Product, 'findById').mockResolvedValueOnce(null);

        await createOrder(req as Request, res as Response, next);

        sinon.assert.calledOnce(next);
        expect(next.args[0][0]).toBeInstanceOf(NotFoundError);
        expect(next.args[0][0].message).toBe(
            'Product with ID 605c72ef153207001f8f8f5 not found',
        );
    });

    it('should return a 400 error if there is insufficient stock', async () => {
        const mockProduct1 = {
            _id: '605c72ef153207001f8f8f5',
            name: 'Product 1',
            stock: 5,
            save: sinon.stub().resolves(true),
        };

        jest.spyOn(Product, 'findById').mockResolvedValueOnce(
            mockProduct1 as any,
        );

        await createOrder(req as Request, res as Response, next);

        sinon.assert.calledOnce(next);
        expect(next.args[0][0]).toBeInstanceOf(BadRequestError);
        expect(next.args[0][0].message).toBe(
            'Insufficient stock for product Product 1',
        );
    });
});
