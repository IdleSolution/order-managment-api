import { Request, Response } from 'express';
import * as sinon from 'sinon';
import { sellProduct } from '../../commands/sellProduct';
import Product from '../../../../models/product.model';
import { BadRequestError, NotFoundError } from '../../../../types/errors';

describe('sellProduct command', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        req = {
            body: {
                productId: '605c72ef153207001f8f8f5',
                quantity: 10,
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

    it('should successfully sell a product and reduce stock', async () => {
        const mockProduct = {
            _id: '605c72ef153207001f8f8f5',
            name: 'Test Product',
            price: 100,
            stock: 50,
            save: sinon.stub().resolves(true),
        };

        jest.spyOn(Product, 'findById').mockResolvedValue(mockProduct as any);

        await sellProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(mockProduct.save);
        expect(mockProduct.stock).toBe(40);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: '605c72ef153207001f8f8f5',
                name: 'Test Product',
                price: 100,
                stock: 40,
            }),
        );
    });

    it('should return a 404 error if the product is not found', async () => {
        jest.spyOn(Product, 'findById').mockResolvedValue(null);

        await sellProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(next);
        expect(next.args[0][0]).toBeInstanceOf(NotFoundError);
        expect(next.args[0][0].message).toBe('Product not found');
    });

    it('should return a 400 error if there is insufficient stock', async () => {
        const mockProduct = {
            _id: '605c72ef153207001f8f8f5',
            name: 'Test Product',
            price: 100,
            stock: 5,
            save: sinon.stub().resolves(true),
        };

        jest.spyOn(Product, 'findById').mockResolvedValue(mockProduct as any);

        await sellProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(next);
        expect(next.args[0][0]).toBeInstanceOf(BadRequestError);
        expect(next.args[0][0].message).toBe('Insufficient stock');
    });
});
