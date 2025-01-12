import { Request, Response } from 'express';
import * as sinon from 'sinon';
import { restockProduct } from '../../commands/restockProduct';
import Product from '../../../../models/product.model';
import { NotFoundError } from '../../../../types/errors';

describe('restockProduct command', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        req = {
            body: {
                productId: '605c72ef153207001f8f8f5',
                quantity: 20,
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

    it('should successfully restock a product', async () => {
        const mockProduct = {
            _id: '605c72ef153207001f8f8f5',
            name: 'Test Product',
            price: 100,
            stock: 50,
            save: sinon.stub().resolves(true),
        };

        sinon.stub(Product, 'findById').resolves(mockProduct as any);

        await restockProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(mockProduct.save);
        expect(mockProduct.stock).toBe(70);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: '605c72ef153207001f8f8f5',
                name: 'Test Product',
                price: 100,
                stock: 70,
            }),
        );
    });

    it('should return a 404 error if the product is not found', async () => {
        sinon.stub(Product, 'findById').resolves(null);

        await restockProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(next);
        expect(next.args[0][0]).toBeInstanceOf(NotFoundError);
        expect(next.args[0][0].message).toBe('Product not found');
    });
});
