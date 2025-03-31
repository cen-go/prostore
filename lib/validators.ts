import { z } from "zod";

import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  category: z.string().min(3, "Category must be at least 3 characters."),
  brand: z.string().min(1, "Brand cannot be empty."),
  description: z.string().min(3, "Description must be at least 3 characters."),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image."),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// schema for signing users in
export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

// Schema for signing up a user
export const SignUpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least two characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least six characters"),
  confirmPassword: z.string().min(6, "Password must be at least six characters"),
}).refine( (data) => data.password === data.confirmPassword, {
  message: "Passwords don't match!",
  path: ["confirmPassword"],
});

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qnty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  id: z.string().optional(),
  items: z.array(cartItemSchema),
  price: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});