import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Category name is required" }).trim(),
    slug: z.string().optional(), 
    isDeleted: z.boolean().optional().default(false),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Category name is required" }).trim().optional(),
    slug: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
