import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { config } from './config/env';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(bodyParser.json());

mongoose.connect(config.MONGO_URI);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);

export default app;
