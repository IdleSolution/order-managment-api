import { Request, Response } from 'express';
import * as sinon from 'sinon';
import Product from '../../../../models/product.model';
import { listProducts } from '../../queries/listProducts';

describe('listProducts query', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should list all products successfully', async () => {
        const mockProducts = [
            {
                _id: '605c72ef153207001f8f8f5',
                name: 'Product 1',
                price: 100,
                stock: 50,
            },
            {
                _id: '605c72ef153207001f8f8f6',
                name: 'Product 2',
                price: 200,
                stock: 30,
            },
        ];

        jest.spyOn(Product, 'find').mockResolvedValue(mockProducts as any);

        await listProducts(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(mockProducts);

        expect(Product.find).toHaveBeenCalledTimes(1);
    });
});
