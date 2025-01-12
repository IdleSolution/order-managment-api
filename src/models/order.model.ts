import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: { type: Number, required: true },
        },
    ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
