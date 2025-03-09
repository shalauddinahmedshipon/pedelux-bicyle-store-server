import { model, Schema } from 'mongoose';
import { Order } from './order.interface';

const OrderSchema = new Schema<Order>(
  {
    email: {
      type: String,
      required: [true, 'Product Name must be required'],

      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    product: {
      type: String,
      required: [true, 'Product Name must be required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product order quantity is is required'],
      min: [1, 'You have to order minimum 1 Product'],
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<Order>('Order', OrderSchema);
