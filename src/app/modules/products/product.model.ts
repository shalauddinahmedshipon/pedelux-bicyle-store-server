import { Schema, model } from 'mongoose';
import { Bicycle } from './product.interface';

const ProductSchema = new Schema<Bicycle>(
  {
    name: {
      type: String,
      required: [true, 'Bicyle name is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
      min: [0, 'price must be a positive number'],
    },
    type: {
      type: String,
      enum: {
        values: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        message: '{VALUE} is not a valid type',
      },
    },
    description: {
      type: String,
      required: [true, 'Short description about the product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'the quantity of a product is required'],
      min: [0, 'quantity must be a positive number'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const Product = model<Bicycle>('Product', ProductSchema);
