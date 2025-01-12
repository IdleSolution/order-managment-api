import { Request, Response } from 'express';
import * as sinon from 'sinon';
import Product from '../../../../models/product.model';
import { addProduct } from '../../commands/addProduct';

describe('addProduct command', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Product',
                price: 100,
                stock: 50,
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

    it('should add a new product successfully', async () => {
        const saveStub = sinon.stub().resolves({
            name: 'Test Product',
            price: 100,
            stock: 50,
        });

        sinon.stub(Product.prototype, 'save').callsFake(saveStub);

        await addProduct(req as Request, res as Response, next);

        sinon.assert.calledOnce(saveStub);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Test Product',
                price: 100,
                stock: 50,
            }),
        );
    });
});
