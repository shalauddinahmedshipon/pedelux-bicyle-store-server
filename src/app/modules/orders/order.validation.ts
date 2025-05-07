import { z } from 'zod';
import mongoose from 'mongoose';
import { orderStatuses, paymentStatus } from './order.constant';

const createOrderValidationSchema = z.object({
  body: z
    .object({
      user: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid user ID',
        })
        .optional(),
      products: z.array(
        z.object({
          bicycle: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: 'Invalid bicycle/product ID',
            }),
          quantity: z
            .number()
            .min(1, { message: 'Quantity must be at least 1' }),
          price: z
            .number()
            .min(0, { message: 'Price must be a positive number' }),
        }),
      ),
      isDeleted: z.boolean().default(false).optional(),
      totalPrice: z
        .number()
        .min(0, { message: 'Total price must be a positive number' }),

      status: z.enum(orderStatuses as [string, ...string[]]).default('pending'),
      paymentStatus: z
        .enum(paymentStatus as [string, ...string[]])
        .default('pending'),

      phoneNumber: z.string().min(1, { message: 'Phone Number is required' }),
      paymentMethod: z
        .string()
        .min(1, { message: 'Payment method is required' }),

      surjoPayTransactionId: z.string().optional(),

      shippingAddress: z.object({
        street: z.string().min(1, { message: 'Street is required' }).trim(),
        city: z.string().min(1, { message: 'City is required' }).trim(),
        state: z.string().min(1, { message: 'State is required' }).trim(),
        zipCode: z.string().min(1, { message: 'Zip Code is required' }).trim(),
        country: z.string().min(1, { message: 'Country is required' }).trim(),
      }),
    })
    .strict(),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    products: z
      .array(
        z.object({
          bicycle: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: 'Invalid bicycle/product ID',
            }),
          quantity: z
            .number()
            .min(1, { message: 'Quantity must be at least 1' }),
          price: z
            .number()
            .min(0, { message: 'Price must be a positive number' }),
        }),
      )
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
    totalPrice: z
      .number()
      .min(0, { message: 'Total price must be a positive number' })
      .optional(),
    phoneNumber: z
      .string()
      .min(1, { message: 'Phone Number is required' })
      .optional(),
    status: z.enum(orderStatuses as [string, ...string[]]).optional(),

    paymentMethod: z
      .string()
      .min(1, { message: 'Payment method is required' })
      .optional(),

    surjoPayTransactionId: z.string().optional(),

    shippingAddress: z
      .object({
        street: z.string().min(1, { message: 'Street is required' }).trim(),
        city: z.string().min(1, { message: 'City is required' }).trim(),
        state: z.string().min(1, { message: 'State is required' }).trim(),
        zipCode: z.string().min(1, { message: 'Zip Code is required' }).trim(),
        country: z.string().min(1, { message: 'Country is required' }).trim(),
      })
      .optional(),
  }),
});

export const orderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
