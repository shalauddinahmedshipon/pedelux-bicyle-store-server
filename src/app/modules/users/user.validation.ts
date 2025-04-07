import { z } from "zod";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    status: z.enum(["active", "deactivated"]).optional().default("active"),
    role: z.enum(["admin", "customer"]).optional().default("customer"),
    isDeleted:z.boolean().optional().default(false)
  }),
});



const updateUserStatusValidationScheme = z.object({
  body: z.object({
    userId: z.string().optional(),
    status: z.enum(['active', 'deactivated']).optional(),
    role: z.enum(["admin", "customer"]).optional()
  }),
});

export const userValidation = {
  registerUserValidationSchema,
  updateUserStatusValidationScheme
};
