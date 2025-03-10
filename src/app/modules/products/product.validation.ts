import { z } from "zod";
import mongoose from "mongoose";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Product name is required" }).trim(),
    brand: z.string().min(1, { message: "Brand is required" }).trim(),
    model: z.string().min(1, { message: "Model is required" }).trim(),
    category: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid category ID",
    }),
    isDeleted:z.boolean().default(false),
    price: z.number().min(0, { message: "Price cannot be negative" }),
    stock: z.number().min(0, { message: "Stock cannot be negative" }),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: "Invalid image URL format" }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Product name is required" }).trim().optional(),
    brand: z.string().min(1, { message: "Brand is required" }).trim().optional(),
    model: z.string().min(1, { message: "Model is required" }).trim().optional(),
    category: z.string().optional().refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid category ID",
    }),
    isDeleted:z.boolean().optional(),
    price: z.number().min(0, { message: "Price cannot be negative" }).optional(),
    stock: z.number().min(0, { message: "Stock cannot be negative" }).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: "Invalid image URL format" }).optional(),
  }),
});

export const productValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
