import { z } from "zod";
import { PaymentMethod, UserRole } from "@prisma/client";

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

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required'),
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

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  addressTitle: z.string().min(2, "Title is required"),
  fullName: z.string().min(4, "Full name is required"),
  streetAddress: z.string().min(3, "Address is required"),
  city: z.string().min(3, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(3, "Country is required"),
});

// Schema for payment method
export const paymentMethodSchema = z.object({
  type: z.enum([PaymentMethod.PayPal, PaymentMethod.Stripe, PaymentMethod.CashOnDelivery], {
    required_error: "You need to select a payment method.",
  }),
})

// Schema for interting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required").nullable(),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.enum([PaymentMethod.PayPal, PaymentMethod.Stripe, PaymentMethod.CashOnDelivery]),
  shippingAddress: shippingAddressSchema
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: currency,
  qnty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
});

// Schema to admin update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.enum([UserRole.user, UserRole.admin]),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(3, "Description must be at least 3 characters."),
  productId: z.string().min(1, "Product is required."),
  userId: z.string().min(1, "User is required."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "rating cant be more than 5"),
});